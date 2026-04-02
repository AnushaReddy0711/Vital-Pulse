package com.bloodsystem.service;

import com.bloodsystem.dto.AnalyticsDTO;
import com.bloodsystem.entity.Role;
import com.bloodsystem.entity.RequestStatus;
import com.bloodsystem.repository.BloodInventoryRepository;
import com.bloodsystem.repository.BloodRequestRepository;
import com.bloodsystem.repository.DonorRepository;
import com.bloodsystem.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final UserRepository userRepository;
    private final DonorRepository donorRepository;
    private final BloodRequestRepository requestRepository;
    private final BloodInventoryRepository inventoryRepository;
    private final InventoryService inventoryService;

    public AnalyticsDTO getAnalytics() {
        long totalDonors = userRepository.findByRole(Role.DONOR).size();
        long totalPatients = userRepository.findByRole(Role.PATIENT).size();
        long totalHospitals = userRepository.findByRole(Role.HOSPITAL).size();
        long totalUsers = userRepository.count();
        long totalRequests = requestRepository.count();
        long pending = requestRepository.countByStatus(RequestStatus.PENDING);
        long approved = requestRepository.countByStatus(RequestStatus.APPROVED);
        long completed = requestRepository.countByStatus(RequestStatus.COMPLETED);
        long rejected = requestRepository.countByStatus(RequestStatus.REJECTED);
        long emergency = requestRepository.findByEmergencyTrue().size();
        long eligible = donorRepository.findByEligibleTrue().size();
        int lowStock = inventoryRepository.findLowStock(10).size();

        return AnalyticsDTO.builder()
                .totalDonors(totalDonors)
                .totalPatients(totalPatients)
                .totalHospitals(totalHospitals)
                .totalUsers(totalUsers)
                .totalRequests(totalRequests)
                .pendingRequests(pending)
                .approvedRequests(approved)
                .completedRequests(completed)
                .rejectedRequests(rejected)
                .emergencyRequests(emergency)
                .eligibleDonors(eligible)
                .inventoryByBloodGroup(inventoryService.getTotalByBloodGroup())
                .lowStockAlerts(lowStock)
                .build();
    }
}
