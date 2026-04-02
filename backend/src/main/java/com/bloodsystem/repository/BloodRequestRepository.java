package com.bloodsystem.repository;

import com.bloodsystem.entity.BloodRequest;
import com.bloodsystem.entity.RequestStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BloodRequestRepository extends JpaRepository<BloodRequest, Long> {
    List<BloodRequest> findByStatus(RequestStatus status);
    List<BloodRequest> findByPatientId(Long patientId);
    List<BloodRequest> findByEmergencyTrue();
    List<BloodRequest> findByBloodGroupAndCity(String bloodGroup, String city);
    long countByStatus(RequestStatus status);
}
