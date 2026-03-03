// Updated api.js - Connect to your EMS backend
const API_BASE_URL = 'http://localhost:4000'; // Adjust port if needed

// Get CSRF token if your backend requires it
async function getCSRFToken() {
    try {
        const response = await fetch(`${API_BASE_URL}/csrf-token`, {
            method: 'GET',
            credentials: 'include'
        });
        const data = await response.json();
        return data.token;
    } catch (error) {
        console.log('No CSRF token endpoint found');
        return null;
    }
}

// Login function
async function login(username, password) {
    try {
        const response = await fetch(`${API_BASE_URL}/api/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
            credentials: 'include'
        });

        if (response.ok) {
            const data = await response.json();
            return { success: true, data };
        } else {
            const error = await response.json();
            return { success: false, error: error.message };
        }
    } catch (error) {
        return { success: false, error: 'Network error' };
    }
}

// Get all employees
async function getEmployees() {
    try {
        const response = await fetch(`${API_BASE_URL}/api/employees`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include'
        });

        if (response.ok) {
            const employees = await response.json();
            return { success: true, data: employees };
        } else {
            return { success: false, error: 'Failed to fetch employees' };
        }
    } catch (error) {
        return { success: false, error: 'Network error' };
    }
}

// Get employee by ID
async function getEmployeeById(id) {
    try {
        const response = await fetch(`${API_BASE_URL}/api/employees/${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include'
        });

        if (response.ok) {
            const employee = await response.json();
            return { success: true, data: employee };
        } else {
            return { success: false, error: 'Employee not found' };
        }
    } catch (error) {
        return { success: false, error: 'Network error' };
    }
}

// Add new employee
async function addEmployee(employeeData) {
    try {
        const response = await fetch(`${API_BASE_URL}/api/employees`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(employeeData),
            credentials: 'include'
        });

        if (response.ok) {
            const employee = await response.json();
            return { success: true, data: employee };
        } else {
            const error = await response.json();
            return { success: false, error: error.message };
        }
    } catch (error) {
        return { success: false, error: 'Network error' };
    }
}

// Update employee
async function updateEmployee(id, employeeData) {
    try {
        const response = await fetch(`${API_BASE_URL}/api/employees/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(employeeData),
            credentials: 'include'
        });

        if (response.ok) {
            const employee = await response.json();
            return { success: true, data: employee };
        } else {
            const error = await response.json();
            return { success: false, error: error.message };
        }
    } catch (error) {
        return { success: false, error: 'Network error' };
    }
}

// Delete employee
async function deleteEmployee(id) {
    try {
        const response = await fetch(`${API_BASE_URL}/api/employees/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include'
        });

        if (response.ok) {
            return { success: true, message: 'Employee deleted successfully' };
        } else {
            const error = await response.json();
            return { success: false, error: error.message };
        }
    } catch (error) {
        return { success: false, error: 'Network error' };
    }
}

// Search employees
async function searchEmployees(query = '', department = '') {
    try {
        const params = new URLSearchParams();
        if (query) params.append('q', query);
        if (department) params.append('department', department);

        const response = await fetch(`${API_BASE_URL}/api/employees/search?${params}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include'
        });

        if (response.ok) {
            const employees = await response.json();
            return { success: true, data: employees };
        } else {
            return { success: false, error: 'Failed to search employees' };
        }
    } catch (error) {
        return { success: false, error: 'Network error' };
    }
}

// Logout
async function logout() {
    try {
        const response = await fetch(`${API_BASE_URL}/api/logout`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include'
        });

        return response.ok;
    } catch (error) {
        console.error('Logout error:', error);
        return false;
    }
}

// Export all functions
window.API = {
    login,
    getEmployees,
    getEmployeeById,
    addEmployee,
    updateEmployee,
    deleteEmployee,
    searchEmployees,
    logout
};
