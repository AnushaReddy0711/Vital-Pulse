package com.bloodsystem.service;

import com.bloodsystem.dto.DonorRequest;
import com.bloodsystem.entity.Donor;
import com.bloodsystem.entity.User;
import com.bloodsystem.repository.DonorRepository;
import com.bloodsystem.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class DonorService {

    private final DonorRepository donorRepository;
    private final UserRepository userRepository;

    public Donor registerDonor(DonorRequest request) {
        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found: " + request.getUserId()));

        if (donorRepository.findByUserId(user.getId()).isPresent()) {
            throw new RuntimeException("Donor already registered for this user");
        }

        Donor donor = Donor.builder()
                .bloodGroup(request.getBloodGroup())
                .eligible(request.isEligible())
                .user(user)
                .build();
        return donorRepository.save(donor);
    }

    public List<Donor> getAllDonors() {
        return donorRepository.findAll();
    }

    public List<Donor> getMatchingDonors(String bloodGroup, String city) {
        if (city != null && !city.isBlank()) {
            return donorRepository.findMatchingDonors(bloodGroup, city);
        }
        return donorRepository.findEligibleByBloodGroup(bloodGroup);
    }

    public Donor getDonorByUserId(Long userId) {
        return donorRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Donor profile not found for user: " + userId));
    }

    public Donor updateEligibility(Long donorId, boolean eligible) {
        Donor donor = donorRepository.findById(donorId)
                .orElseThrow(() -> new RuntimeException("Donor not found: " + donorId));
        donor.setEligible(eligible);
        if (!eligible) {
            donor.setLastDonationDate(LocalDate.now());
        }
        return donorRepository.save(donor);
    }

    public long countEligible() {
        return donorRepository.findByEligibleTrue().size();
    }
}
