package com.bloodsystem.config;

import com.bloodsystem.entity.*;
import com.bloodsystem.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.LocalDate;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final DonorRepository donorRepository;
    private final BloodInventoryRepository inventoryRepository;
    private final BloodRequestRepository requestRepository;

    @Override
    public void run(String... args) {
        if (userRepository.count() > 0) return; // already seeded

        log.info("🚀 VitalPulse: Seeding demo data...");

        // --- Admin ---
        userRepository.save(User.builder()
                .name("VP Admin").email("admin@blood.com").password("admin123")
                .role(Role.ADMIN).city("Delhi").build());

        // --- Hospital Users ---
        User hospital1 = userRepository.save(User.builder()
                .name("VitalPulse Blood Bank").email("hospital@blood.com").password("hospital123")
                .role(Role.HOSPITAL).city("Delhi").build());

        User hospital2 = userRepository.save(User.builder()
                .name("Apollo Hospital").email("apollo@blood.com").password("apollo123")
                .role(Role.HOSPITAL).city("Mumbai").build());

        // --- Donor Users ---
        User donorUser1 = userRepository.save(User.builder()
                .name("Rahul Sharma").email("rahul@donor.com").password("donor123")
                .role(Role.DONOR).city("Delhi").build());

        User donorUser2 = userRepository.save(User.builder()
                .name("Priya Singh").email("priya@donor.com").password("donor123")
                .role(Role.DONOR).city("Mumbai").build());

        User donorUser3 = userRepository.save(User.builder()
                .name("Amit Kumar").email("amit@donor.com").password("donor123")
                .role(Role.DONOR).city("Delhi").build());

        User donorUser4 = userRepository.save(User.builder()
                .name("Sneha Patel").email("sneha@donor.com").password("donor123")
                .role(Role.DONOR).city("Bangalore").build());

        // --- Patient Users ---
        User patient1 = userRepository.save(User.builder()
                .name("Vikram Reddy").email("patient@blood.com").password("patient123")
                .role(Role.PATIENT).city("Delhi").build());

        User patient2 = userRepository.save(User.builder()
                .name("Meena Joshi").email("meena@patient.com").password("patient123")
                .role(Role.PATIENT).city("Mumbai").build());

        // --- Donors ---
        donorRepository.save(Donor.builder()
                .bloodGroup("A+").eligible(true).user(donorUser1).build());

        donorRepository.save(Donor.builder()
                .bloodGroup("B+").eligible(true).user(donorUser2).build());

        donorRepository.save(Donor.builder()
                .bloodGroup("O+").eligible(false).lastDonationDate(LocalDate.now().minusDays(50))
                .user(donorUser3).build());

        donorRepository.save(Donor.builder()
                .bloodGroup("AB+").eligible(true).user(donorUser4).build());

        // --- Blood Inventory (City Blood Bank) ---
        String[] bloodGroups = {"A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"};
        int[] units1 = {25, 8, 30, 5, 40, 3, 15, 6};
        for (int i = 0; i < bloodGroups.length; i++) {
            inventoryRepository.save(BloodInventory.builder()
                    .hospitalName("City Blood Bank")
                    .bloodGroup(bloodGroups[i])
                    .unitsAvailable(units1[i])
                    .hospitalUser(hospital1).build());
        }

        // --- Blood Inventory (Apollo Hospital) ---
        int[] units2 = {12, 4, 18, 2, 22, 1, 9, 3};
        for (int i = 0; i < bloodGroups.length; i++) {
            inventoryRepository.save(BloodInventory.builder()
                    .hospitalName("Apollo Hospital")
                    .bloodGroup(bloodGroups[i])
                    .unitsAvailable(units2[i])
                    .hospitalUser(hospital2).build());
        }

        // --- Blood Requests ---
        requestRepository.save(BloodRequest.builder()
                .bloodGroup("A+").units(2).city("Delhi")
                .emergency(false).status(RequestStatus.PENDING)
                .notes("Required for surgery").patient(patient1).build());

        requestRepository.save(BloodRequest.builder()
                .bloodGroup("O-").units(4).city("Mumbai")
                .emergency(true).status(RequestStatus.APPROVED)
                .notes("Emergency — accident case").patient(patient2).build());

        requestRepository.save(BloodRequest.builder()
                .bloodGroup("B+").units(1).city("Delhi")
                .emergency(false).status(RequestStatus.COMPLETED)
                .notes("Post-operative care").patient(patient1).build());

        log.info("✅ Demo data seeded successfully.");
        log.info("🔑 Login credentials:");
        log.info("   Admin    → admin@blood.com / admin123");
        log.info("   Hospital → hospital@blood.com / hospital123");
        log.info("   Donor    → rahul@donor.com / donor123");
        log.info("   Patient  → patient@blood.com / patient123");
    }
}
