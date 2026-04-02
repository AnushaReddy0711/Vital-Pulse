package com.bloodsystem.controller;

import com.bloodsystem.dto.AnalyticsDTO;
import com.bloodsystem.entity.User;
import com.bloodsystem.service.AdminService;
import com.bloodsystem.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"})
public class AdminController {

    private final AdminService adminService;
    private final UserService userService;

    @GetMapping("/analytics")
    public AnalyticsDTO getAnalytics() {
        return adminService.getAnalytics();
    }

    @GetMapping("/users")
    public List<User> getAllUsers() {
        return userService.getAllUsers();
    }
}
