package com.ProjectManagementApp.repository;

import com.ProjectManagementApp.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User,Long> {

}
