const pool=require('./db');

exports.createEmployee= async(req,res)=>{
    try {
        const {name,date_of_joining,designation, gender, email,bio}=req.body;
        const employeeData= await pool.query("INSERT INTO EMPLOYEE(name,date_of_joining,designation,gender,email,bio) VALUES($1,$2,$3,$4,$5,$6) returning *",
                    [name,date_of_joining,designation, gender, email,bio])
        res.json(employeeData.rows[0]);
    } catch (error) {
        res.status(500).json(error);
    }
}

exports.createDepartment=async(req,res)=>{
    try {
        const {name,email,description}=req.body;
        const departmentData= await pool.query("INSERT INTO DEPARTMENT(name,email,description) VALUES($1,$2,$3) returning *",
                    [name,email,description])
        res.json(departmentData.rows[0]);
        logger.info("Department created successfully!")
    } catch (error) {
        res.status(500).json(error);
        logger.error("Error occurred: " + error);
    }
}

exports.createEmployeeAssignment= async(req,res)=>{
    try {
        const {employee_id,department_id}=req.body;
        const employeeAssignmentData= await pool.query("INSERT INTO EMPLOYEE_ASSIGNMENT(employee_id,department_id) VALUES($1,$2) returning *",
                    [employee_id,department_id])
        res.json(employeeAssignmentData.rows[0]);
        logger.info("Employee Assignment done successfully!")
    } catch (error) {
        res.status(500).json(error);
        logger.error("Error occurred: " + error);
    }
}