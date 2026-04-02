package com.bloodsystem.dto;

import lombok.Data;
import lombok.Builder;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AnalyticsDTO {
    private long totalDonors;
    private long totalPatients;
    private long totalHospitals;
    private long totalUsers;
    private long totalRequests;
    private long pendingRequests;
    private long approvedRequests;
    private long completedRequests;
    private long rejectedRequests;
    private long emergencyRequests;
    private long eligibleDonors;
    private Map<String, Long> inventoryByBloodGroup;
    private int lowStockAlerts;
}
