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
  GridStateModule
} from "ag-grid-community";

ModuleRegistry.registerModules([
  ClientSideRowModelModule,
  PaginationModule,
  CellStyleModule,
  RowSelectionModule,
  CsvExportModule,
  GridStateModule,
  QuickFilterModule
]);


export default function Grid() {
  const gridRef = useRef<AgGridReact<{ [key: string]: string | number }>>(null);

  //nuqs state management
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
    parse: (value) => (value ? JSON.parse((value)) : []),
    serialize: (value) => ((value)),
    defaultValue: [],
  });
  console.log(sortModel); 



  // Get skill names from data
  const skillNames = useMemo(() => {
    const skillsSet = new Set<string>();
    applications.forEach((app) => {
      app.skills.forEach((skill) => skillsSet.add(skill.name));
    });
    return Array.from(skillsSet);
  }, []);

  const staticColumns = ["name", "email", "location", "ctc", "applicationStatus"];
  const allColumns = [...staticColumns, ...skillNames];

  //search filter
  const onFilterTextBoxChanged = useCallback(() => {
    gridRef.current?.api.setGridOption(
      "quickFilterText",
      (document.getElementById("filter-text-box") as HTMLInputElement).value
    );
  }, []);

  //export button
  const onBtnExport = useCallback(() => {
    gridRef.current?.api.exportDataAsCsv();
  }, []);



  //showing skills as columns (grid)
  const rowData = useMemo(() => {
    return applications.map((app) => {
      const row: { [key: string]: string | number } = {
        name: app.name,
        email: app.email,
        location: app.location,
        ctc: app.ctc,
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
      {
        headerName: "Name",
        field: "name",
        hide: hiddenColumns.includes("name"),
        filter: "agTextColumnFilter",
        floatingFilter: true, // Enables inline filtering
        filterParams: { debounceMs: 200 }, // Adds delay for smoother filtering
      },
      {
        headerName: "Email",
        field: "email",
        hide: hiddenColumns.includes("email"),
        filter: "agTextColumnFilter",
        floatingFilter: true,
      },
      {
        headerName: "Location",
        field: "location",
        hide: hiddenColumns.includes("location"),
        filter: "agTextColumnFilter",
        floatingFilter: true,
      },
      {
        headerName: "CTC",
        field: "ctc",
        hide: hiddenColumns.includes("ctc"),
        filter: "agNumberColumnFilter",
        floatingFilter: true,
      },
      {
        headerName: "Application Status",
        field: "applicationStatus",
        hide: hiddenColumns.includes("applicationStatus"),
        filter: "agSetColumnFilter",
        floatingFilter: true,
      },
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





  //toogle columns
  const toggleColumn = (columnName: string) => {
    setHiddenColumns((prev) => {
      const updatedHiddenColumns = prev.includes(columnName)
        ? prev.filter((col) => col !== columnName)
        : [...prev, columnName];

      return updatedHiddenColumns.length > 0 ? updatedHiddenColumns : null;
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
            {allColumns.map((column) => (
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
