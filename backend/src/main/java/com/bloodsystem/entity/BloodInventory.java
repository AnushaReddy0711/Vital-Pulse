package com.bloodsystem.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "blood_inventory")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BloodInventory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String hospitalName;

    private String bloodGroup;

    @Builder.Default
    private int unitsAvailable = 0;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "hospital_user_id")
    private User hospitalUser;

    private LocalDateTime updatedAt;

    @PrePersist
    @PreUpdate
    public void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
