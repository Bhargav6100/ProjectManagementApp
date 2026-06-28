package com.ProjectManagementApp.repository;

import com.ProjectManagementApp.entity.User;
import com.ProjectManagementApp.entity.Workspace;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
public interface WorkSpaceRepository extends JpaRepository<Workspace,Long> {


}
