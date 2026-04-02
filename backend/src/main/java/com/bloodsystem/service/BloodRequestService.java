package com.bloodsystem.service;

import com.bloodsystem.dto.BloodRequestDTO;
import com.bloodsystem.entity.BloodRequest;
import com.bloodsystem.entity.RequestStatus;
import com.bloodsystem.entity.User;
import com.bloodsystem.entity.BloodInventory;
import com.bloodsystem.repository.BloodInventoryRepository;
import com.bloodsystem.repository.BloodRequestRepository;
import com.bloodsystem.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BloodRequestService {

    private final BloodRequestRepository requestRepository;
    private final UserRepository userRepository;
    private final BloodInventoryRepository inventoryRepository;

    public BloodRequest createRequest(BloodRequestDTO dto) {
        User patient = userRepository.findById(dto.getPatientId())
                .orElseThrow(() -> new RuntimeException("Patient not found: " + dto.getPatientId()));

        BloodRequest request = BloodRequest.builder()
                .bloodGroup(dto.getBloodGroup())
                .units(dto.getUnits())
                .city(dto.getCity())
                .emergency(dto.isEmergency())
                .notes(dto.getNotes())
                .patient(patient)
                .status(RequestStatus.PENDING)
                .build();
        return requestRepository.save(request);
    }

    public List<BloodRequest> getAllRequests() {
        return requestRepository.findAll().stream()
                .sorted(Comparator.comparing(BloodRequest::isEmergency).reversed()
                        .thenComparing(BloodRequest::getCreatedAt, Comparator.reverseOrder()))
                .collect(Collectors.toList());
    }

    public List<BloodRequest> getRequestsByPatient(Long patientId) {
        return requestRepository.findByPatientId(patientId);
    }

    public BloodRequest updateStatus(Long requestId, RequestStatus status, Long hospitalUserId) {
        BloodRequest request = requestRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Request not found: " + requestId));

        // Logic for fulfillment
        if (status == RequestStatus.COMPLETED || status == RequestStatus.APPROVED) {
            if (hospitalUserId == null) {
                throw new RuntimeException("Hospital identity required for fulfillment");
            }

            BloodInventory inventory = inventoryRepository.findByHospitalUserIdAndBloodGroup(hospitalUserId, request.getBloodGroup());

            if (inventory == null || inventory.getUnitsAvailable() < request.getUnits()) {
                throw new RuntimeException("Insufficient blood stock for group " + request.getBloodGroup());
            }

            // Deduct units
            inventory.setUnitsAvailable(inventory.getUnitsAvailable() - request.getUnits());
            inventoryRepository.save(inventory);

            // Per spec: fulfillment marks as COMPLETED
            request.setStatus(RequestStatus.COMPLETED);
        } else {
            request.setStatus(status);
        }

        return requestRepository.save(request);
    }

    public long countByStatus(RequestStatus status) {
        return requestRepository.countByStatus(status);
    }

    public long countTotal() {
        return requestRepository.count();
    }
}
