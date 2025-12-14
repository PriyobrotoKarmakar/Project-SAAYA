package com.saaya;

import org.junit.Test;
import static org.junit.Assert.assertTrue;
import java.net.HttpURLConnection;
import java.net.URL;
import java.io.BufferedReader;
import java.io.InputStreamReader;

public class SaayaTest {

   
    @Test
    public void testBackendIsRunning() {
        System.out.println("  [Maven QA] Starting Project Saaya Health Check...");
        System.out.println("   Target: " + TestConfig.HEALTH_URL);
        
        boolean isUp = checkUrl(TestConfig.HEALTH_URL);
 
        assertTrue(" CRITICAL: Backend is Down! Deployment Aborted.", isUp);
        
        System.out.println(" [Success] Backend is Healthy. Ready for Cloud Deployment.");
    }

   
    @Test
    public void testAlertsEndpoint() {
        System.out.println("\n[Maven QA] Testing Alerts API Endpoint...");
        System.out.println("   Target: " + TestConfig.ALERTS_URL);
        
        boolean isResponding = checkUrl(TestConfig.ALERTS_URL);
        
        assertTrue("[FAIL] Alerts endpoint not responding!", isResponding);
        
        System.out.println("[Success] Alerts API is operational.");
    }

   
    @Test
    public void testStatsEndpoint() {
        System.out.println("\n[Maven QA] Testing Stats API Endpoint...");
        System.out.println("   Target: " + TestConfig.STATS_URL);
        
        boolean isResponding = checkUrl(TestConfig.STATS_URL);
        
        assertTrue("[FAIL] Stats endpoint not responding!", isResponding);
        
        System.out.println("[Success] Stats API is operational.");
    }

    
    @Test
    public void testHealthResponseStructure() {
        System.out.println("\n[Maven QA] Validating Health Response Structure...");
        
        try {
            URL url = new URL(TestConfig.HEALTH_URL);
            HttpURLConnection connection = (HttpURLConnection) url.openConnection();
            connection.setRequestMethod("GET");
            connection.connect();
            
            int code = connection.getResponseCode();
            if (code == 200) {
                BufferedReader reader = new BufferedReader(
                    new InputStreamReader(connection.getInputStream())
                );
                StringBuilder response = new StringBuilder();
                String line;
                while ((line = reader.readLine()) != null) {
                    response.append(line);
                }
                reader.close();
                
                String jsonResponse = response.toString();
                System.out.println("   Response: " + jsonResponse);
                
                // Validate JSON contains expected fields
                assertTrue("Response missing 'status' field", jsonResponse.contains("\"status\""));
                assertTrue("Response missing 'service' field", jsonResponse.contains("\"service\""));
                assertTrue("Response missing 'timestamp' field", jsonResponse.contains("\"timestamp\""));
                
                System.out.println("[Success] Health response structure is valid.");
            } else {
                assertTrue("Health endpoint returned non-200 status: " + code, false);
            }
        } catch (Exception e) {
            System.out.println("[Error] Validating response: " + e.getMessage());
            assertTrue("Failed to validate health response structure", false);
        }
    }

    
    private boolean checkUrl(String urlString) {
        try {
            URL url = new URL(urlString);
            HttpURLConnection connection = (HttpURLConnection) url.openConnection();
            connection.setRequestMethod("GET");
            connection.setConnectTimeout(5000); // 5 second timeout
            connection.setReadTimeout(5000);
            connection.connect();
            
            int code = connection.getResponseCode();
            System.out.println("   --> HTTP Response Code: " + code);
            
            return code == 200;
        } catch (Exception e) {
            System.out.println("   --> [Error] Connecting to Backend: " + e.getMessage());
            return false;
        }
    }
}
