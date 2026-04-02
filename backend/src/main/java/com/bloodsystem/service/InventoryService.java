package com.bloodsystem.service;

import com.bloodsystem.dto.InventoryDTO;
import com.bloodsystem.entity.BloodInventory;
import com.bloodsystem.entity.User;
import com.bloodsystem.repository.BloodInventoryRepository;
import com.bloodsystem.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.LinkedHashMap;

@Service
@RequiredArgsConstructor
public class InventoryService {

    private final BloodInventoryRepository inventoryRepository;
    private final UserRepository userRepository;

    public BloodInventory addInventory(InventoryDTO dto) {
        User hospitalUser = userRepository.findById(dto.getHospitalUserId())
                .orElseThrow(() -> new RuntimeException("Hospital user not found: " + dto.getHospitalUserId()));

        BloodInventory inventory = BloodInventory.builder()
                .hospitalName(dto.getHospitalName())
                .bloodGroup(dto.getBloodGroup())
                .unitsAvailable(dto.getUnitsAvailable())
                .hospitalUser(hospitalUser)
                .build();
        return inventoryRepository.save(inventory);
    }

    public List<BloodInventory> getAllInventory() {
        return inventoryRepository.findAll();
    }

    public List<BloodInventory> getInventoryByHospital(Long hospitalUserId) {
        return inventoryRepository.findByHospitalUserIdOrderByBloodGroupAsc(hospitalUserId);
    }

    public BloodInventory updateUnits(Long inventoryId, int unitsAvailable) {
        BloodInventory inv = inventoryRepository.findById(inventoryId)
                .orElseThrow(() -> new RuntimeException("Inventory entry not found: " + inventoryId));
        inv.setUnitsAvailable(unitsAvailable);
        return inventoryRepository.save(inv);
    }

    public void deleteInventory(Long inventoryId) {
        inventoryRepository.deleteById(inventoryId);
    }

    public List<BloodInventory> getLowStockAlerts(int threshold) {
        return inventoryRepository.findLowStock(threshold);
    }

    public Map<String, Long> getTotalByBloodGroup() {
        List<Object[]> results = inventoryRepository.getTotalUnitsByBloodGroup();
        Map<String, Long> map = new LinkedHashMap<>();
        for (Object[] row : results) {
            map.put((String) row[0], ((Number) row[1]).longValue());
        }
        return map;
    }
}
