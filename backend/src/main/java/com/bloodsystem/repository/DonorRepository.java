package com.bloodsystem.repository;

import com.bloodsystem.entity.Donor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DonorRepository extends JpaRepository<Donor, Long> {

    Optional<Donor> findByUserId(Long userId);

    List<Donor> findByBloodGroup(String bloodGroup);

    List<Donor> findByEligibleTrue();

    @Query("SELECT d FROM Donor d WHERE d.bloodGroup = :bloodGroup AND d.eligible = true AND LOWER(d.user.city) = LOWER(:city)")
    List<Donor> findMatchingDonors(@Param("bloodGroup") String bloodGroup, @Param("city") String city);

    @Query("SELECT d FROM Donor d WHERE d.bloodGroup = :bloodGroup AND d.eligible = true")
    List<Donor> findEligibleByBloodGroup(@Param("bloodGroup") String bloodGroup);
}
