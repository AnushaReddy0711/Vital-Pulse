package com.bloodsystem.dto;

import lombok.Data;

@Data
public class InventoryDTO {
    private String hospitalName;
    private String bloodGroup;
    private int unitsAvailable;
    private Long hospitalUserId;
}
