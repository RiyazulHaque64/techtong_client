import { Grid } from "@mui/material";

import { DashboardContent } from "src/layouts/dashboard";

import { CourierTable } from "../courier/courier-table";

export function UtilsView() {
    return (
        <DashboardContent>
            <Grid container>
                <Grid item xs={12}>
                    <CourierTable />
                </Grid>
            </Grid>
        </DashboardContent>
    )
}