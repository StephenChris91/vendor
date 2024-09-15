// utils/reportGenerator.ts
import jsPDF from "jspdf";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { DashboardData } from "hooks/useDashboardData";

export const generateReports = (data: DashboardData) => {
    const generatePDFReport = () => {
        const doc = new jsPDF();
        doc.setFontSize(18);
        doc.text("Admin Dashboard Report", 20, 20);
        doc.setFontSize(12);
        doc.text(`Total Sales: $${data.totalSales?.toLocaleString() ?? "N/A"}`, 20, 40);
        doc.text(`Total Orders: ${data.totalOrders ?? "N/A"}`, 20, 50);
        doc.text(`Active Users: ${data.activeUsers ?? "N/A"}`, 20, 60);
        doc.text(`Active Vendors: ${data.activeVendors ?? "N/A"}`, 20, 70);

        doc.text("Recent Orders:", 20, 90);
        data.recentOrders?.forEach((order, index) => {
            doc.text(`${order.user} - $${order.amount} - ${order.status}`, 30, 100 + index * 10);
        });

        doc.text("Sales Data:", 20, 150);
        data.salesData?.forEach((item, index) => {
            doc.text(`${item.name}: $${item.sales}`, 30, 160 + index * 10);
        });

        doc.save("admin_dashboard_report.pdf");
    };

    const generateExcelReport = () => {
        const ws = XLSX.utils.json_to_sheet([
            {
                "Total Sales": data.totalSales ?? "N/A",
                "Total Orders": data.totalOrders ?? "N/A",
                "Active Users": data.activeUsers ?? "N/A",
                "Active Vendors": data.activeVendors ?? "N/A",
            },
        ]);

        const salesWs = XLSX.utils.json_to_sheet(data.salesData ?? []);
        const ordersWs = XLSX.utils.json_to_sheet(data.recentOrders ?? []);
        const activitiesWs = XLSX.utils.json_to_sheet(data.recentActivities ?? []);

        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Overview");
        XLSX.utils.book_append_sheet(wb, salesWs, "Sales Data");
        XLSX.utils.book_append_sheet(wb, ordersWs, "Recent Orders");
        XLSX.utils.book_append_sheet(wb, activitiesWs, "Recent Activities");

        const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
        const blob = new Blob([excelBuffer], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8",
        });
        saveAs(blob, "admin_dashboard_report.xlsx");
    };

    generatePDFReport();
    generateExcelReport();
};