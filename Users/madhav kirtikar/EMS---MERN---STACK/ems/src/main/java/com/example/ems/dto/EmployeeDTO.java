 package com.example.ems.dto;

public class EmployeeDTO {
    private Long id;
    private String name;
    private String department;
    private String position;
    private String email;
    private String phone;
    private String address;
    private Double salary;
    private String photo;
    private String gender;
    private Integer age;
    private Double performance;

    public EmployeeDTO() {}

    public EmployeeDTO(Long id, String name, String department, String position, String email,
                       String phone, String address, Double salary, String photo,
                       String gender, Integer age, Double performance) {
        this.id = id;
        this.name = name;
        this.department = department;
        this.position = position;
        this.email = email;
        this.phone = phone;
        this.address = address;
        this.salary = salary;
        this.photo = photo;
        this.gender = gender;
        this.age = age;
        this.performance = performance;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getDepartment() { return department; }
    public void setDepartment(String department) { this.department = department; }

    public String getPosition() { return position; }
    public void setPosition(String position) { this.position = position; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public Double getSalary() { return salary; }
    public void setSalary(Double salary) { this.salary = salary; }

    public String getPhoto() { return photo; }
    public void setPhoto(String photo) { this.photo = photo; }

    public String getGender() { return gender; }
    public void setGender(String gender) { this.gender = gender; }

    public Integer getAge() { return age; }
    public void setAge(Integer age) { this.age = age; }

    public Double getPerformance() { return performance; }
    public void setPerformance(Double performance) { this.performance = performance; }
}
