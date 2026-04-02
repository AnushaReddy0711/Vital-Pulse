package com.bloodsystem.dto;

import lombok.Data;

@Data
public class BloodRequestDTO {
    private String bloodGroup;
    private int units;
    private String city;
    private boolean emergency;
    private String notes;
    private Long patientId;
}
