let conn = require("../../../config/database");
let md5 = require("md5");
let common = require("../../../utilities/common");
// let responseCode = require("../../../../utilities/response-error-code");

class admin {
    
    

    static getDashboard(req, res) {
        try {
            console.log("Fetching Dashboard Data...");
    
            let queries = {
                total_users: "SELECT COUNT(*) AS total FROM tbl_user",
                subscribed_users: "SELECT COUNT(*) AS total FROM tbl_user WHERE is_subscribed = 1",
                total_orders: "SELECT COUNT(*) AS total FROM tbl_order",
                confirmed_orders: "SELECT COUNT(*) AS total FROM tbl_order WHERE o_status = 'confirmed'",
                in_preparation_orders: "SELECT COUNT(*) AS total FROM tbl_order WHERE o_status = 'in_preparation'",
                out_of_delivery_orders: "SELECT COUNT(*) AS total FROM tbl_order WHERE o_status = 'out_of_delivery'",
                completed_order: "SELECT COUNT(*) AS total FROM tbl_order WHERE o_status = 'completed'",
                delivered_orders: "SELECT COUNT(*) AS total FROM tbl_order WHERE o_status = 'delivered'",
                total_meals: "SELECT COUNT(*) AS total FROM tbl_menu",
                breakfast_meals: "SELECT COUNT(*) AS total FROM tbl_menu WHERE day_time = 'Breakfast'",
                lunch_meals: "SELECT COUNT(*) AS total FROM tbl_menu WHERE day_time = 'Lunch'",
                dinner_meals: "SELECT COUNT(*) AS total FROM tbl_menu WHERE day_time = 'Dinner'"
            };
    
            let results = {};
            let keys = Object.keys(queries);
            let completed = 0;
    
            keys.forEach((key) => {
                conn.query(queries[key], (error, result) => {
                    if (error) {
                        console.error(`Database Error in ${key}:`, error);
                        results[key] = 0;
                    } else {
                        results[key] = result[0].total;
                    }
    
                    completed++;
                    if (completed === keys.length) {
                        let response = {
                            code: 1, // Success
                            message: "Dashboard data retrieved successfully",
                            data: results
                        };
                        res.status(200).json(response);
                    }
                });
            });
    
        } catch (error) {
            console.error("Dashboard Error:", error.message);
            res.status(500).json({ code: 0, message: "Dashboard fetch error", error: error.message });
        }
    }

    
    static getUsers(req, res) {
        try {
            console.log("Fetching Users List...");
    
            let query = "SELECT * FROM tbl_user ORDER BY id DESC";
            conn.query(query, (error, results) => {
                if (error) {
                    console.error("Database Error:", error);
                    return res.status(500).send({ code: 0, message: "Database error", error });
                }
    
                res.status(200).send({ code: 1, message: "Users retrieved successfully", data: results });
            });
        } catch (error) {
            console.error("Get Users Error:", error.message);
            res.status(500).send({ code: 0, message: "Failed to retrieve users", error: error.message });
        }
    }
    
    static getOrders(req, res) {
        try {
            console.log("Fetching Orders List...");
    
            let query = `
                SELECT * FROM tbl_order
                ORDER BY id DESC
            `;
            conn.query(query, (error, results) => {
                if (error) {
                    console.error("Database Error:", error);
                    return res.status(500).send({ code: 0, message: "Database error", error });
                }
    
                res.status(200).send({ code: 1, message: "Orders retrieved successfully", data: results });
            });
        } catch (error) {
            console.error("Get Orders Error:", error.message);
            res.status(500).send({ code: 0, message: "Failed to retrieve orders", error: error.message });
        }
    }
    
    static getMeals(req, res) {
        try {
            console.log("Fetching Meals List...");
    
            let query = "SELECT * FROM tbl_menu ORDER BY id DESC";
            conn.query(query, (error, results) => {
                if (error) {
                    console.error("Database Error:", error);
                    return res.status(500).send({ code: 0, message: "Database error", error });
                }
    
                res.status(200).send({ code: 1, message: "Meals retrieved successfully", data: results });
            });
        } catch (error) {
            console.error("Get Meals Error:", error.message);
            res.status(500).send({ code: 0, message: "Failed to retrieve meals", error: error.message });
        }
    }
    
    static deleteUser(req, res) {
        try {
            console.log("Received Request Body:", req.body);
    
            let { user_id } = req.body;
            if (!user_id) {
                return res.status(400).send({ code: 0, message: "User ID is required" });
            }
    
            let query = "UPDATE tbl_user SET is_deleted = 1 WHERE id = ?";
            conn.query(query, [user_id], (error, result) => {
                if (error) {
                    console.error("Database Error:", error);
                    return res.status(500).send({ code: 0, message: "Database error", error });
                }
    
                if (result.affectedRows === 0) {
                    return res.status(404).send({ code: 2, message: "User not found" });
                }
    
                res.status(200).send({ code: 1, message: "User deleted successfully" });
            });
    
        } catch (error) {
            console.error("Delete User Error:", error.message);
            res.status(500).send({ code: 0, message: "Failed to delete user", error: error.message });
        }
    }
    
    static deactivateUser(req, res) {
        try {
            console.log("Received Request Body:", req.body);
    
            let { user_id } = req.body;
            if (!user_id) {
                return res.status(400).send({ code: 0, message: "User ID is required" });
            }
    
            let query = "UPDATE tbl_user SET is_active = 0 WHERE id = ?";
            conn.query(query, [user_id], (error, result) => {
                if (error) {
                    console.error("Database Error:", error);
                    return res.status(500).send({ code: 0, message: "Database error", error });
                }
    
                if (result.affectedRows === 0) {
                    return res.status(404).send({ code: 2, message: "User not found" });
                }
    
                res.status(200).send({ code: 1, message: "User deactivated successfully" });
            });
    
        } catch (error) {
            console.error("Deactivate User Error:", error.message);
            res.status(500).send({ code: 0, message: "Failed to deactivate user", error: error.message });
        }
    }

    static activateUser(req, res) {
        try {
            console.log("Received Request Body:", req.body);
    
            let { user_id } = req.body;
            if (!user_id) {
                return res.status(400).send({ code: 0, message: "User ID is required" });
            }
    
            let query = "UPDATE tbl_user SET is_active = 1 WHERE id = ?";
            conn.query(query, [user_id], (error, result) => {
                if (error) {
                    console.error("Database Error:", error);
                    return res.status(500).send({ code: 0, message: "Database error", error });
                }
    
                if (result.affectedRows === 0) {
                    return res.status(404).send({ code: 2, message: "User not found" });
                }
    
                res.status(200).send({ code: 1, message: "User activated successfully" });
            });
    
        } catch (error) {
            console.error("activate User Error:", error.message);
            res.status(500).send({ code: 0, message: "Failed to activate user", error: error.message });
        }
    }
    
    static addMenuItem(req, res) {
        try {
            const { name, kcal, carbs, protein, fat, description, ingredients, img, day_time } = req.body;
    
            if (!name || !kcal || !carbs || !protein || !fat || !description || !ingredients || !img || !day_time) {
                return res.status(400).json({ code: 0, message: "All fields are required" });
            }
    
            const validDayTimes = ['Breakfast', 'Lunch', 'Dinner'];
            if (!validDayTimes.includes(day_time)) {
                return res.status(400).json({ code: 0, message: "Invalid day_time value" });
            }
    
            let query = "INSERT INTO tbl_menu (name, kcal, carbs, protien, fat, description, incredients, img, day_time, is_deleted) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 0)";
            conn.query(query, [name, kcal, carbs, protein, fat, description, ingredients, img, day_time], (error, result) => {
                if (error) {
                    console.error("Database Error:", error);
                    return res.status(500).json({ code: 0, message: "Database error", error });
                }
                res.status(201).json({ code: 1, message: "Menu item added successfully", menu_id: result.insertId });
            });
    
        } catch (error) {
            console.error("Add Menu Item Error:", error.message);
            res.status(500).json({ code: 0, message: "Failed to add menu item", error: error.message });
        }
    }

    static updateMenuItem(req, res) {
        try {
            const { id, name, kcal, carbs, protein, fat, description, ingredients, img, day_time } = req.body;
    
            if (!id || !name || !kcal || !carbs || !protein || !fat || !description || !ingredients || !img || !day_time) {
                return res.status(400).json({ code: 0, message: "All fields are required" });
            }
    
            const validDayTimes = ['Breakfast', 'Lunch', 'Dinner'];
            if (!validDayTimes.includes(day_time)) {
                return res.status(400).json({ code: 0, message: "Invalid day_time value" });
            }
    
            let query = "UPDATE tbl_menu SET name=?, kcal=?, carbs=?, protien=?, fat=?, description=?, incredients=?, img=?, day_time=? WHERE id=? AND is_deleted=0";
            conn.query(query, [name, kcal, carbs, protein, fat, description, ingredients, img, day_time, id], (error, result) => {
                if (error) {
                    console.error("Database Error:", error);
                    return res.status(500).json({ code: 0, message: "Database error", error });
                }
                if (result.affectedRows === 0) {
                    return res.status(404).json({ code: 2, message: "Menu item not found or already deleted" });
                }
                res.status(200).json({ code: 1, message: "Menu item updated successfully" });
            });
    
        } catch (error) {
            console.error("Update Menu Item Error:", error.message);
            res.status(500).json({ code: 0, message: "Failed to update menu item", error: error.message });
        }
    }

    static deleteMenuItem(req, res) {
        try {
            const { id } = req.body;
    
            if (!id) {
                return res.status(400).json({ code: 0, message: "Menu ID is required" });
            }
    
            let query = "UPDATE tbl_menu SET is_deleted=1 WHERE id=? AND is_deleted=0";
            conn.query(query, [id], (error, result) => {
                if (error) {
                    console.error("Database Error:", error);
                    return res.status(500).json({ code: 0, message: "Database error", error });
                }
                if (result.affectedRows === 0) {
                    return res.status(404).json({ code: 2, message: "Menu item not found or already deleted" });
                }
                res.status(200).json({ code: 1, message: "Menu item deleted successfully (soft delete)" });
            });
    
        } catch (error) {
            console.error("Delete Menu Item Error:", error.message);
            res.status(500).json({ code: 0, message: "Failed to delete menu item", error: error.message });
        }
    }
    

}

module.exports = admin;