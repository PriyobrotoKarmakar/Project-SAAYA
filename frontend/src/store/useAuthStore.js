import { create } from "zustand";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { toast } from "sonner";

export const useAuthStore = create((set, get) => ({
  user: null,
  profile: null, // Store Firestore data here
  role: null,
  loading: false,

  // 1. SIGNUP LOGIC
  signup: async (email, password, role, name, additionalData = {}) => {
    set({ loading: true });
    try {
      // A. Create Authentication User
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password,
      );
      const user = userCredential.user;

      // B. Save Role & Profile to Database
      const profileData = {
        uid: user.uid,
        name: name,
        email: email,
        role: role,
        createdAt: new Date().toISOString(),
        ...additionalData, // Save role specific fields
      };

      await setDoc(doc(db, "users", user.uid), profileData);

      set({ user: user, role: role, profile: profileData, loading: false });
      toast.success("Account created successfully!");
    } catch (error) {
      toast.error(error.message);
      set({ loading: false });
      throw error;
    }
  },

  // 2. LOGIN LOGIC
  login: async (email, password) => {
    set({ loading: true });
    try {
      // A. Authenticate
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password,
      );
      const user = userCredential.user;

      // B. Fetch Role from Database
      const userDoc = await getDoc(doc(db, "users", user.uid));

      if (userDoc.exists()) {
        const userData = userDoc.data();
        set({
          user: user,
          role: userData.role,
          profile: userData,
          loading: false,
        });
        toast.success(`Welcome back, ${userData.name}`);
      } else {
        // STRICT MODE: No profile = No access
        await signOut(auth);
        set({ user: null, role: null, profile: null, loading: false });
        throw new Error("Profile not found. Please contact support.");
      }
    } catch (error) {
      toast.error(error.message || "Invalid email or password");
      set({ loading: false });
      throw error;
    }
  },

  logout: async () => {
    try {
      await signOut(auth);
    } catch {}
    set({ user: null, role: null, profile: null });
    toast.info("Logged out successfully");
  },

  setUser: (user) => set({ user }),

  // New Action: Sync User Profile on Reload
  syncUser: async (user) => {
    if (!user) {
      set({ user: null, role: null, profile: null, loading: false });
      return;
    }
    set({ loading: true });
    try {
      const userDoc = await getDoc(doc(db, "users", user.uid));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        set({
          user: user,
          role: userData.role,
          profile: userData,
          loading: false,
        });
      } else {
        // STRICT MODE: No profile = No access
        await signOut(auth);
        set({ user: null, role: null, profile: null, loading: false });
        // Optional: toast.error("Session invalid. Profile missing.");
      }
    } catch (e) {
      console.error("Sync failed", e);
      set({ loading: false });
    }
  },

  setLoading: (loading) => set({ loading }),

  // 3. UPDATE PROFILE LOGIC
  updateProfile: async (updatedData) => {
    const { user, profile } = get();
    if (!user) return;

    set({ loading: true });
    try {
      const newProfile = { ...profile, ...updatedData };
      // Merge new data with existing profile in Firestore
      await setDoc(doc(db, "users", user.uid), newProfile, { merge: true });

      set({ profile: newProfile, loading: false });
      toast.success("Profile updated successfully");
    } catch (error) {
      console.error("Update failed", error);
      toast.error("Failed to update profile");
      set({ loading: false });
      throw error;
    }
  },

  loginAsGuest: () => {
    set({ loading: true });
    setTimeout(() => {
      const guestProfile = {
        uid: "guest-123",
        email: "interviewer@saaya.demo",
        name: "Guest User",
        role: "police",
      };

      set({
        user: { ...guestProfile, displayName: "Guest User" },
        role: "police",
        profile: guestProfile,
        loading: false,
      });
      toast.success("Welcome to Demo Mode", {
        description: "You have read-only access to Police command features.",
      });
    }, 1000);
  },
}));
