package com.ProjectManagementApp.dto;

import com.ProjectManagementApp.entity.ProjectStatus;

public class ProjectStatusPatch {
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
