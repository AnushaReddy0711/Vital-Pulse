package com.bloodsystem.controller;

import com.bloodsystem.dto.DonorRequest;
import com.bloodsystem.entity.Donor;
import com.bloodsystem.service.DonorService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/donors")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"})
public class DonorController {

    private final DonorService donorService;

    @PostMapping
    public ResponseEntity<?> registerDonor(@RequestBody DonorRequest request) {
        try {
            return ResponseEntity.ok(donorService.registerDonor(request));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping
    public List<Donor> getAllDonors() {
        return donorService.getAllDonors();
    }

    @GetMapping("/match")
    public List<Donor> matchDonors(
            @RequestParam String bloodGroup,
            @RequestParam(required = false, defaultValue = "") String city) {
        return donorService.getMatchingDonors(bloodGroup, city);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<?> getDonorByUser(@PathVariable Long userId) {
        try {
            return ResponseEntity.ok(donorService.getDonorByUserId(userId));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/{id}/eligibility")
    public ResponseEntity<?> updateEligibility(
            @PathVariable Long id,
            @RequestParam boolean eligible) {
        try {
            return ResponseEntity.ok(donorService.updateEligibility(id, eligible));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}
