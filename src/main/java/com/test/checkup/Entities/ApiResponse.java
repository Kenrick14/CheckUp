package com.test.checkup.Entities;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import java.util.List;

public class ApiResponse<T> {
    @JsonIgnoreProperties(ignoreUnknown = true)
    private List<T> data;

    public List<T> getData() { return data; }
    public void setData(List<T> data) { this.data = data; }

}
