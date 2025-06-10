import { sql } from "../config/db.js";

export async function getTransactionsByUserId(req, res) {
  try {
    const { userId } = req.params;
    const transactions =
      await sql`SELECT * FROM transactions WHERE user_id = ${userId} ORDER BY created_at DESC`;
    return res.status(200).json(transactions);
  } catch (error) {
    console.log("error getting the transactions", error);
    res.status(500).json({ message: "internal server error" });
  }
}
export async function createTransaction(req, res) {
  try {
    const { title, amount, category, user_id } = req.body;
    if (!title || !user_id || !category || amount === undefined) {
      return res.status(400).json({ message: "all fields are required" });
    }
    const transaction = await sql`INSERT INTO transactions(
        user_id, title, amount, category
    )VALUES(${user_id}, ${title}, ${amount}, ${category})
    RETURNING *
    `;
    console.log(transaction);
    return res.status(201).json({
      message: "Transaction created successfully",
      transaction: transaction[0],
    });
  } catch (error) {
    console.log("error creating the transactions", error);
    res.status(500).json({ message: "internal server error" });
  }
}
export async function deleteTransaction(req, res) {
  try {
    const { id } = req.params;
    if (isNaN(parseInt(id))) {
      return res.status(400).json({ message: "Invalide transaction id" });
    }
    const result =
      await sql`DELETE FROM transactions WHERE id = ${id} RETURNING *`;
    if (result.length === 0) {
      return res.status(404).json({ message: "Transaction not found" });
    }
    return res
      .status(200)
      .json({ message: "Transaction deleted successfully" });
  } catch (error) {
    console.log("error deleting the transactions", error);
    res.status(500).json({ message: "internal server error" });
  }
}

export async function getSummaryByUserId(req, res) {
  try {
    const { userId } = req.params;
    const balanceResult =
      await sql`SELECT COALESCE(SUM(amount), 0) as balance FROM transactions WHERE user_id = ${userId} `;
    const incomeResult =
      await sql`SELECT COALESCE(SUM(amount), 0) as income FROM transactions WHERE user_id = ${userId} AND amount > 0`;
    const expensesResult =
      await sql`SELECT COALESCE(SUM(amount), 0) as expenses FROM transactions WHERE user_id = ${userId} And amount < 0`;
    return res.status(200).json({
      balance: balanceResult[0].balance,
      income: incomeResult[0].income,
      expenses: expensesResult[0].expenses,
    });
  } catch (error) {
    console.log("error getting the summary", error);
    res.status(500).json({ message: "internal server error" });
  }
}
