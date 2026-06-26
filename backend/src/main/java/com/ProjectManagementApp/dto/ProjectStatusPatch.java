package com.ProjectManagementApp.dto;

import com.ProjectManagementApp.entity.ProjectStatus;
import jakarta.validation.constraints.NotNull;

public class ProjectStatusPatch {
 @NotNull(message = "Project status is required")
 private ProjectStatus status;

 public ProjectStatusPatch(){

 }
 public ProjectStatusPatch(ProjectStatus projectStatus){
  this.status=projectStatus;
 }

 public ProjectStatus getProjectStatus() {
  return status;
 }

 public void setProjectStatus(ProjectStatus projectStatus) {
  this.status = projectStatus;
 }
}
