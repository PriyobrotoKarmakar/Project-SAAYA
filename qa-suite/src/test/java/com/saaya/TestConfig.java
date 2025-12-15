package com.saaya;

public class TestConfig {
    public static final String BACKEND_IP = "44.220.152.89";
    public static final String BACKEND_PORT = "5000";
    public static final String BASE_URL = "http://" + BACKEND_IP + ":" + BACKEND_PORT;
    public static final String HEALTH_URL = BASE_URL + "/api/health";
    public static final String ALERTS_URL = BASE_URL + "/api/alerts";
    public static final String STATS_URL = BASE_URL + "/api/stats";
    public static final String TELEMETRY_URL = BASE_URL + "/api/telemetry";
}
