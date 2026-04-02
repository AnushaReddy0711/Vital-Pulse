package com.bloodsystem.repository;

import com.bloodsystem.entity.BloodInventory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BloodInventoryRepository extends JpaRepository<BloodInventory, Long> {
    List<BloodInventory> findByBloodGroup(String bloodGroup);
    List<BloodInventory> findByHospitalUserIdOrderByBloodGroupAsc(Long hospitalUserId);
    List<BloodInventory> findByUnitsAvailableLessThan(int threshold);
    BloodInventory findByHospitalUserIdAndBloodGroup(Long hospitalUserId, String bloodGroup);

    @Query("SELECT b.bloodGroup, SUM(b.unitsAvailable) FROM BloodInventory b GROUP BY b.bloodGroup")
    List<Object[]> getTotalUnitsByBloodGroup();

    @Query("SELECT b FROM BloodInventory b WHERE b.unitsAvailable < :threshold")
    List<BloodInventory> findLowStock(@Param("threshold") int threshold);
}
