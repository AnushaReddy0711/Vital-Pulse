package com.bloodsystem.controller;

import com.bloodsystem.dto.BloodRequestDTO;
import com.bloodsystem.entity.BloodRequest;
import com.bloodsystem.entity.Donor;
import com.bloodsystem.entity.RequestStatus;
import com.bloodsystem.service.BloodRequestService;
import com.bloodsystem.service.DonorService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/requests")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"})
public class BloodRequestController {

    private final BloodRequestService requestService;
    private final DonorService donorService;

    @PostMapping
    public ResponseEntity<?> createRequest(@RequestBody BloodRequestDTO dto) {
        try {
            return ResponseEntity.ok(requestService.createRequest(dto));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping
    public List<BloodRequest> getAllRequests() {
        return requestService.getAllRequests();
    }

    @GetMapping("/patient/{patientId}")
    public List<BloodRequest> getRequestsByPatient(@PathVariable Long patientId) {
        return requestService.getRequestsByPatient(patientId);
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateStatus(
            @PathVariable Long id,
            @RequestParam RequestStatus status,
            @RequestParam(required = false) Long hospitalUserId) {
        try {
            return ResponseEntity.ok(requestService.updateStatus(id, status, hospitalUserId));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/match")
    public List<Donor> matchDonors(
            @RequestParam String bloodGroup,
            @RequestParam(required = false, defaultValue = "") String city) {
        return donorService.getMatchingDonors(bloodGroup, city);
    }
}
