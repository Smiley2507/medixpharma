package com.example.pharmacy;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

import com.example.pharmacy.entity.Role;
import com.example.pharmacy.enums.ERole;
import com.example.pharmacy.repository.RoleRepository;

@SpringBootApplication
public class PharmacyManagementApplication {

	public static void main(String[] args) {
		SpringApplication.run(PharmacyManagementApplication.class, args);
	}

	@Bean
    public CommandLineRunner seedRoles(RoleRepository roleRepository) {
        return args -> {
            // Seed ROLE_ADMIN
            if (roleRepository.findByName(ERole.ROLE_ADMIN).isEmpty()) {
                Role adminRole = new Role();
                adminRole.setName(ERole.ROLE_ADMIN);
                roleRepository.save(adminRole);
                System.out.println("Seeded ROLE_ADMIN");
            }

            // Seed ROLE_PHARMACIST
            if (roleRepository.findByName(ERole.ROLE_PHARMACIST).isEmpty()) {
                Role pharmacistRole = new Role();
                pharmacistRole.setName(ERole.ROLE_PHARMACIST);
                roleRepository.save(pharmacistRole);
                System.out.println("Seeded ROLE_PHARMACIST");
            }

            // Seed ROLE_STAFF
            if (roleRepository.findByName(ERole.ROLE_STAFF).isEmpty()) {
                Role staffRole = new Role();
                staffRole.setName(ERole.ROLE_STAFF);
                roleRepository.save(staffRole);
                System.out.println("Seeded ROLE_STAFF");
            }
        };
    }

}
