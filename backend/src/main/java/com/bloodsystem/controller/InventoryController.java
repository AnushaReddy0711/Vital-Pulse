package com.bloodsystem.controller;

import com.bloodsystem.dto.InventoryDTO;
import com.bloodsystem.entity.BloodInventory;
import com.bloodsystem.service.InventoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/inventory")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"})
public class InventoryController {

    private final InventoryService inventoryService;

    @PostMapping
    public ResponseEntity<?> addInventory(@RequestBody InventoryDTO dto) {
        try {
            return ResponseEntity.ok(inventoryService.addInventory(dto));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping
    public List<BloodInventory> getAllInventory() {
        return inventoryService.getAllInventory();
    }

    @GetMapping("/hospital/{hospitalUserId}")
    public List<BloodInventory> getInventoryByHospital(@PathVariable Long hospitalUserId) {
        return inventoryService.getInventoryByHospital(hospitalUserId);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateInventory(
            @PathVariable Long id,
            @RequestParam int units) {
        try {
            return ResponseEntity.ok(inventoryService.updateUnits(id, units));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteInventory(@PathVariable Long id) {
        inventoryService.deleteInventory(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/low-stock")
    public List<BloodInventory> getLowStock(@RequestParam(defaultValue = "10") int threshold) {
        return inventoryService.getLowStockAlerts(threshold);
    }
}
