"use client";
import React, { useCallback, useMemo, useRef, useEffect } from "react";
import { RowSelectionModule } from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";
import { useQueryState } from "nuqs";
import applications from "../../../sample-applications.json";
import { Input } from "@/components/ui/input";
import { Download, SearchIcon, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import {
  ClientSideRowModelModule,
  PaginationModule,
  CellStyleModule,
  CsvExportModule,
  ModuleRegistry,
  QuickFilterModule,
  GridStateModule,
  ValidationModule,
  ColumnApiModule,
  DateFilterModule,
  CustomFilterModule,
  TextFilterModule,
  NumberFilterModule
} from "ag-grid-community";

ModuleRegistry.registerModules([
  ClientSideRowModelModule,
  PaginationModule,
  CellStyleModule,
  RowSelectionModule,
  CsvExportModule,
  GridStateModule,
  QuickFilterModule,
  ValidationModule,
  ColumnApiModule,
  DateFilterModule,
  CustomFilterModule,
  TextFilterModule,
  NumberFilterModule
]);

export default function Grid() {
  const gridRef = useRef<AgGridReact<{ [key: string]: string | number }>>(null);

  // nuqs state management
  const [searchName, setSearchName] = useQueryState("search", { history: "push", defaultValue: "" });
  const [page, setPage] = useQueryState("page", { history: "push", defaultValue: "1" });
  const [pageSize, setPageSize] = useQueryState("pageSize", { history: "push", defaultValue: "20" });
  const [hiddenColumns, setHiddenColumns] = useQueryState<string[]>("hiddenColumns", {
    history: "push",
    parse: (value) => (value ? value.split(",") : []),
    serialize: (value) => value.join(","),
    defaultValue: []
  });

  const [sortModel, setSortModel] = useQueryState("sort", {
    history: "push",
    parse: (value) => (value ? JSON.parse(value) : []), // Deserialize from JSON string
    serialize: (value) => JSON.stringify(value), // Serialize to JSON string
    defaultValue: [],
  });

  // Get skill names from data
  const skillNames = useMemo(() => {
    const skillsSet = new Set<string>();
    applications.forEach((app) => {
      app.skills.forEach((skill) => skillsSet.add(skill.name));
    });
    return Array.from(skillsSet);
  }, []);

  const staticColumns = [
    "createdAt",
    "userId",
    "jobId",
    "name",
    "email",
    "location",
    "ctc",
    "phone",
    "applicationStatus",
    "employer",
    "currentContractType",
    "currentWorkType",
    "preferredWorkType",
    "matchPercentage",
    "offerCTC",
    "offersInHand",
    "overallExperience",
    "willingToRelocate",
    "expectedCTC",
    "noticePeriod",
    "attachmentFileExtension",
  ];
  const allColumns = [...staticColumns, ...skillNames];

  // Search filter
  const onFilterTextBoxChanged = useCallback(() => {
    gridRef.current?.api.setGridOption(
      "quickFilterText",
      (document.getElementById("filter-text-box") as HTMLInputElement).value
    );
  }, []);

  // Export button
  const onBtnExport = useCallback(() => {
    gridRef.current?.api.exportDataAsCsv();
  }, []);

  // Showing skills as columns (grid)
  const rowData = useMemo(() => {
    return applications.map((app) => {
      const row: { [key: string]: string | number } = {
        createdAt: app.createdAt,
        userId: app.userId,
        jobId: app.jobId,
        name: app.name,
        email: app.email,
        location: app.location,
        ctc: app.ctc,
        phone: app.phone,
        currentContractType: app.currentContractType ? app.currentContractType : "N/A",
        currentWorkType : app.currentWorkType ? app.currentWorkType : 'N/A',
        employer: app.employer ? app.employer : "N/A",
        preferredWorkType: app.preferredWorkType ? app.preferredWorkType : "N/A",
        matchPercentage: app.matchPercentage ? app.matchPercentage : 0,
        offerCTC: app.offerCTC ? app.offerCTC : 0,
        offersInHand: app.offersInHand ? app.offersInHand : 0,
        overallExperience: app.overallExperience ? app.overallExperience : 0,
        willingToRelocate: app.willingToRelocate ? "Yes" : "No",
        expectedCTC: app.expectedCTC ? app.expectedCTC : 0,
        noticePeriod: app.noticePeriod ? app.noticePeriod : 0,
        attachmentFileExtension: app.attachmentFileExtension ? app.attachmentFileExtension : "N/A",
        applicationStatus: app.applicationStatus
      };
      skillNames.forEach((skillName) => {
        const skill = app.skills.find((skill) => skill.name === skillName);
        row[skillName] = skill ? skill.years : "N/A";
      });
      return row;
    });
  }, [skillNames]);

  const colDefs = useMemo(() => {
    const staticCols = [
      { headerName: "Date", field: "createdAt", hide: hiddenColumns.includes("createdAt"), sortable: true, filter: "agDateColumnFilter" },
      { headerName: "User-ID", field: "userId", hide: hiddenColumns.includes("userId"), sortable: true, filter: "agTextColumnFilter" },
      { headerName: "Job-ID", field: "jobId", hide: hiddenColumns.includes("jobId"), sortable: true, filter: "agTextColumnFilter" },

      { headerName: "Name", field: "name", hide: hiddenColumns.includes("name"), sortable: true, filter: "agTextColumnFilter" },
      { headerName: "Email", field: "email", hide: hiddenColumns.includes("email"), sortable: true, filter: "agTextColumnFilter" },
      { headerName: "Phone", field: "phone", hide: hiddenColumns.includes("phone"), sortable: true, filter: "agTextColumnFilter" },
      { headerName: "Location", field: "location", hide: hiddenColumns.includes("location"), sortable: true, filter: "agTextColumnFilter" },
      { headerName: "CTC", field: "ctc", hide: hiddenColumns.includes("ctc"), sortable: true, filter: "agNumberColumnFilter" },
      { headerName: "Employer", field: "employer", hide: hiddenColumns.includes("employer"), sortable: true, filter: "agTextColumnFilter" },
      { headerName: "Current Contract Type", field: "currentContractType", hide: hiddenColumns.includes("currentContractType"), sortable: true, filter: "agTextColumnFilter" },
      { headerName: "Current Work Type", field: "currentWorkType", hide: hiddenColumns.includes("currentWorkType"), sortable: true, filter: "agTextColumnFilter" },

      { headerName: "Preferred Work Type", field: "preferredWorkType", hide: hiddenColumns.includes("preferredWorkType"), sortable: true, filter: "agTextColumnFilter" },
      { headerName: "Match Percentage", field: "matchPercentage", hide: hiddenColumns.includes("matchPercentage"), sortable: true, filter: "agNumberColumnFilter" },
      { headerName: "Offer CTC", field: "offerCTC", hide: hiddenColumns.includes("offerCTC"), sortable: true, filter: "agNumberColumnFilter" },
      { headerName: "Offers In Hand", field: "offersInHand", hide: hiddenColumns.includes("offersInHand"), sortable: true, filter: "agNumberColumnFilter" },
      { headerName: "Overall Experience", field: "overallExperience", hide: hiddenColumns.includes("overallExperience"), sortable: true, filter: "agNumberColumnFilter" },
      { headerName: "Willing to Relocate", field: "willingToRelocate", hide: hiddenColumns.includes("willingToRelocate"), sortable: true, filter: "agBooleanColumnFilter" },
      { headerName: "Expected CTC", field: "expectedCTC", hide: hiddenColumns.includes("expectedCTC"), sortable: true, filter: "agNumberColumnFilter" },
      { headerName: "Notice Period", field: "noticePeriod", hide: hiddenColumns.includes("noticePeriod"), sortable: true, filter: "agNumberColumnFilter" },
      { headerName: "Application Status", field: "applicationStatus", hide: hiddenColumns.includes("applicationStatus"), sortable: true, filter: "agTextColumnFilter" },
      { headerName: "Attachment File Extension", field: "attachmentFileExtension", hide: hiddenColumns.includes("attachmentFileExtension"), sortable: true, filter: "agTextColumnFilter" },
    ];

    const skillCols = skillNames.map((skill) => ({
      headerName: skill,
      field: skill,
      hide: hiddenColumns.includes(skill),
      filter: "agNumberColumnFilter",
      floatingFilter: true,
    }));

    return [...staticCols, ...skillCols];
  }, [skillNames, hiddenColumns]);

  // Toggle columns
  const toggleColumn = (columnName: string) => {
    setHiddenColumns((prev) => {
      const updatedHiddenColumns = prev.includes(columnName)
        ? prev.filter((col) => col !== columnName)
        : [...prev, columnName];

      return updatedHiddenColumns.length > 0 ? updatedHiddenColumns : [];
    });
  };

  useEffect(() => {
    if (gridRef.current) {
      gridRef.current?.api?.paginationGoToPage(Number(page) - 1);
    }
  }, [page]);

  return (
    <div className="flex flex-col h-screen p-6 bg-gray-50">
      <div className="mb-8 flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Candidate Grid</h1>
        <Button onClick={onBtnExport}>
          <Download className="mr-2" /> CSV file
        </Button>
      </div>

      <div className="flex space-x-6 justify-between mb-4">
        <div className="relative max-w-md">
          <SearchIcon className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input
            type="text"
            id="filter-text-box"
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
            placeholder="Search "
            onInput={onFilterTextBoxChanged}
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="flex items-center space-x-2">
              <span>Hide Columns</span>
              <ChevronDown className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-64 p-2">
            {allColumns?.map((column) => (
              <DropdownMenuCheckboxItem
                key={column}
                checked={!hiddenColumns.includes(column)}
                onCheckedChange={() => toggleColumn(column)}
              >
                {column}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="h-full rounded-lg shadow-sm">
        <AgGridReact
          ref={gridRef}
          rowData={rowData}
          columnDefs={colDefs}
          pagination={true}
          paginationPageSize={Number(pageSize)}
          defaultColDef={{
            sortable: true,
            filter: true,
            floatingFilter: true,
          }}
          onGridReady={(params) => {
            // Apply the sort model after the grid is ready
            if (sortModel.length > 0) {
              params.api?.applyColumnState({
                state: sortModel,
                applyOrder: false, // Prevent columns from reordering
              });
            }
          }}
          onPaginationChanged={() => {
            if (gridRef.current) {
              setPageSize(gridRef.current?.api?.paginationGetPageSize().toString());
              setPage((gridRef.current?.api?.paginationGetCurrentPage() + 1).toString());
            }
          }}
          onSortChanged={() => {
            if (gridRef.current) {
              console.log(gridRef.current.api.getState().sort?.sortModel[0].sort);
              const sortState = gridRef.current.api.getState().sort?.sortModel[0].sort;
              const colId = gridRef.current.api.getState().sort?.sortModel[0].colId;
              setSortModel(sortState === undefined ? null : sortState + ' ' + colId);
            }
          }}
        />
      </div>
    </div>
  );
}