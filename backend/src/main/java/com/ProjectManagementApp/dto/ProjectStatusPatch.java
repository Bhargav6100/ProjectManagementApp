package com.ProjectManagementApp.dto;

import com.ProjectManagementApp.entity.ProjectStatus;
import jakarta.validation.constraints.NotNull;

public class ProjectStatusPatch {
 @NotNull(message = "Project status is required")
 private ProjectStatus projectStatus;

 public ProjectStatusPatch(){

 }
 public ProjectStatusPatch(ProjectStatus projectStatus){
  this.projectStatus=projectStatus;
 }

 public ProjectStatus getProjectStatus() {
  return projectStatus;
 }

 public void setProjectStatus(ProjectStatus projectStatus) {
  this.projectStatus = projectStatus;
 }
}
