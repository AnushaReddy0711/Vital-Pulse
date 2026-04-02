package com.bloodsystem.dto;

import lombok.Data;

@Data
public class DonorRequest {
    private String bloodGroup;
    private Long userId;
    private boolean eligible = true;
}
