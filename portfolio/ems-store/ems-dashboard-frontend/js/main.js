// Updated main.js - Backend integration
document.addEventListener('DOMContentLoaded', function() {
    // Check authentication
    checkAuth();
    
    // Initialize page-specific functionality
    const currentPage = window.location.pathname.split('/').pop();
    
    switch(currentPage) {
        case 'dashboard.html':
            initDashboard();
            break;
        case 'employees.html':
            initEmployees();
            break;
        case 'add-employee.html':
            initAddEmployee();
            break;
    }
});

// Initialize dashboard
async function initDashboard() {
    await loadDashboardStats();
    loadRecentActivity();
}

// Load dashboard statistics
async function loadDashboardStats() {
    try {
        showLoading(true);
        
        const result = await API.getEmployees();
        
        if (result.success) {
            const employees = result.data;
            const totalEmployees = employees.length;
            const activeEmployees = employees.filter(emp => emp.status === 'Active').length;
            const departments = [...new Set(employees.map(emp => emp.department))].length;
            
            // Calculate recent hires (last 30 days)
            const recentHires = employees.filter(emp => {
                const hireDate = new Date(emp.hire_date || emp.hireDate);
                const thirtyDaysAgo = new Date();
                thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
                return hireDate >= thirtyDaysAgo;
            }).length;
            
            document.getElementById('totalEmployees').textContent = totalEmployees;
            document.getElementById('activeEmployees').textContent = activeEmployees;
            document.getElementById('departments').textContent = departments;
            document.getElementById('newHires').textContent = recentHires;
        } else {
            showError('Failed to load dashboard data: ' + result.error);
        }
    } catch (error) {
        showError('Failed to load dashboard data');
        console.error('Error loading dashboard:', error);
    } finally {
        showLoading(false);
    }
}

// Load recent activity (placeholder)
function loadRecentActivity() {
    // This would fetch recent activity from your backend
    console.log('Loading recent activity...');
}

// Initialize employees page
async function initEmployees() {
    await loadEmployees();
    
    // Add search functionality
    const searchInput = document.getElementById('searchInput');
    const departmentFilter = document.getElementById('departmentFilter');
    
    if (searchInput) {
        searchInput.addEventListener('input', debounce(async function() {
            await filterEmployees();
        }, 300));
    }
    
    if (departmentFilter) {
        departmentFilter.addEventListener('change', async function() {
            await filterEmployees();
        });
    }
}

// Load employees table
async function loadEmployees() {
    try {
        showLoading(true);
        
        const result = await API.getEmployees();
        
        if (result.success) {
            renderEmployeeTable(result.data);
        } else {
            showError('Failed to load employees: ' + result.error);
        }
    } catch (error) {
        showError('Failed to load employees');
        console.error('Error loading employees:', error);
    } finally {
        showLoading(false);
    }
}

// Render employee table
function renderEmployeeTable(employees) {
    const tableBody = document.getElementById('employeeTableBody');
    
    if (!tableBody) return;
    
    if (!employees || employees.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="7" class="text-center">No employees found</td></tr>';
        return;
    }
    
    tableBody.innerHTML = employees.map(employee => `
        <tr>
            <td>${employee.id}</td>
            <td>${employee.first_name || employee.firstName || employee.first_name} ${employee.last_name || employee.lastName || 
employee.last_name}</td>
            <td>${employee.position}</td>
            <td>${employee.department}</td>
            <td>${employee.email}</td>
            <td><span class="status-badge status-${(employee.status || 'Active').toLowerCase()}">${employee.status || 'Active'}</span></td>
            <td>
                <div class="action-buttons">
                    <button class="btn-action btn-edit" onclick="editEmployee(${employee.id})">
                        <i class="fas fa-edit"></i> Edit
                    </button>
                    <button class="btn-action btn-delete" onclick="deleteEmployee(${employee.id})">
                        <i class="fas fa-trash"></i> Delete
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
}

// Filter employees based on search and department
async function filterEmployees() {
    const searchQuery = document.getElementById('searchInput')?.value || '';
    const department = document.getElementById('departmentFilter')?.value || '';
    
    try {
        showLoading(true);
        
        const result = await API.searchEmployees(searchQuery, department);
        
        if (result.success) {
            renderEmployeeTable(result.data);
        } else {
            showError('Failed to filter employees: ' + result.error);
        }
    } catch (error) {
        showError('Failed to filter employees');
        console.error('Error filtering employees:', error);
    } finally {
        showLoading(false);
    }
}

// Initialize add employee form
function initAddEmployee() {
    const employeeForm = document.getElementById('employeeForm');
    
    if (employeeForm) {
        employeeForm.addEventListener('submit', handleAddEmployee);
    }
}

// Handle add employee form submission
async function handleAddEmployee(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const employeeData = {
        first_name: formData.get('firstName'),
        last_name: formData.get('lastName'),
        email: formData.get('email'),
        position: formData.get('position'),
        department: formData.get('department'),
        hire_date: formData.get('hireDate'),
        salary: parseFloat(formData.get('salary')),
        status: formData.get('status')
    };
    
    try {
        showLoading(true);
        
        const result = await API.addEmployee(employeeData);
        
        if (result.success) {
            showSuccess('Employee added successfully!');
            
            // Reset form
            e.target.reset();
            
            // Redirect to employees page after delay
            setTimeout(() => {
                window.location.href = 'employees.html';
            }, 2000);
        } else {
            showError('Failed to add employee: ' + result.error);
        }
    } catch (error) {
        showError('Failed to add employee');
        console.error('Error adding employee:', error);
    } finally {
        showLoading(false);
    }
}

// Edit employee (placeholder)
function editEmployee(id) {
    alert('Edit functionality would be implemented here. Employee ID: ' + id);
    // In real app, this would redirect to edit page or open modal
}

// Delete employee
async function deleteEmployee(id) {
    if (!confirm('Are you sure you want to delete this employee?')) {
        return;
    }
    
    try {
        showLoading(true);
        
        const result = await API.deleteEmployee(id);
        
        if (result.success) {
            showSuccess('Employee deleted successfully!');
            
            // Reload employee table
            await loadEmployees();
        } else {
            showError('Failed to delete employee: ' + result.error);
        }
    } catch (error) {
        showError('Failed to delete employee');
        console.error('Error deleting employee:', error);
    } finally {
        showLoading(false);
    }
}

// Utility functions
function showLoading(show) {
    const loadingElement = document.getElementById('loading');
    if (loadingElement) {
        loadingElement.style.display = show ? 'block' : 'none';
    }
    
    // Also disable buttons during loading
    const buttons = document.querySelectorAll('button');
    buttons.forEach(button => {
        if (show) {
            button.dataset.originalDisabled = button.disabled;
            button.disabled = true;
        } else {
            button.disabled = button.dataset.originalDisabled === 'true';
        }
    });
}

function showError(message) {
    // Remove existing error messages
    const existingErrors = document.querySelectorAll('.alert.alert-danger');
    existingErrors.forEach(el => el.remove());
    
    const errorElement = document.createElement('div');
    errorElement.className = 'alert alert-danger';
    errorElement.innerHTML = `
        <i class="fas fa-exclamation-triangle"></i>
        ${message}
        <button type="button" class="close-alert">&times;</button>
    `;
    errorElement.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #f8d7da;
        color: #721c24;
        padding: 15px 20px;
        border-radius: 5px;
        border: 1px solid #f5c6cb;
        z-index: 1000;
        display: flex;
        align-items: center;
        gap: 10px;
    `;
    
    const closeBtn = errorElement.querySelector('.close-alert');
    closeBtn.style.cssText = 'background: none; border: none; font-size: 20px; cursor: pointer;';
    closeBtn.onclick = () => errorElement.remove();
    
    document.body.appendChild(errorElement);
    
    // Auto-hide after 5 seconds
    setTimeout(() => {
        if (errorElement.parentNode) {
            errorElement.remove();
        }
    }, 5000);
}

function showSuccess(message) {
    // Remove existing success messages
    const existingSuccess = document.querySelectorAll('.alert.alert-success');
    existingSuccess.forEach(el => el.remove());
    
    const successElement = document.createElement('div');
    successElement.className = 'alert alert-success';
    successElement.innerHTML = `
        <i class="fas fa-check-circle"></i>
        ${message}
        <button type="button" class="close-alert">&times;</button>
    `;
    successElement.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #d4edda;
        color: #155724;
        padding: 15px 20px;
        border-radius: 5px;
        border: 1px solid #c3e6cb;
        z-index: 1000;
        display: flex;
        align-items: center;
        gap: 10px;
    `;
    
    const closeBtn = successElement.querySelector('.close-alert');
    closeBtn.style.cssText = 'background: none; border: none; font-size: 20px; cursor: pointer;';
    closeBtn.onclick = () => successElement.remove();
    
    document.body.appendChild(successElement);
    
    // Auto-hide after 3 seconds
    setTimeout(() => {
        if (successElement.parentNode) {
            successElement.remove();
        }
    }, 3000);
}

// Debounce function for search
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}
