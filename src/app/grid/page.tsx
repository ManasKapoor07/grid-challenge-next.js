"use client";

import React, { useCallback, useMemo, useRef, useState } from "react";
import { RowSelectionModule } from 'ag-grid-community';
import { AgGridReact } from "ag-grid-react";
import applications from "../../../sample-applications.json";
import { Input } from "@/components/ui/input";
import { Download, SearchIcon, ChevronDown } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

import {
  ClientSideRowModelModule,
  PaginationModule,
  CellStyleModule,
  GridOptions,
  ModuleRegistry,
  QuickFilterModule,
  CsvExportModule
} from "ag-grid-community";

ModuleRegistry.registerModules([
  QuickFilterModule,
  ClientSideRowModelModule,
  PaginationModule,
  CellStyleModule,
  RowSelectionModule,
  CsvExportModule
]);

export default function Page() {
  const gridRef = useRef<AgGridReact<any>>(null);

  const skillNames = useMemo(() => {
    const skillsSet = new Set<string>();
    applications.forEach((app) => {
      app.skills.forEach((skill) => skillsSet.add(skill.name));
    });
    return Array.from(skillsSet);
  }, []);

  const staticColumns = ["name", "email", "location", "ctc", "applicationStatus"];

  const [visibleColumns, setVisibleColumns] = useState<string[]>([...staticColumns, ...skillNames]);

  const onFilterTextBoxChanged = useCallback(() => {
    gridRef.current!.api.setGridOption(
      "quickFilterText",
      (document.getElementById("filter-text-box") as HTMLInputElement).value,
    );
  }, []);

  const onBtnExport = useCallback(() => {
    gridRef.current!.api.exportDataAsCsv();
  }, []);

  const rowData = useMemo(() => {
    return applications.map((app) => {
      const row: { [key: string]: string | number } = {
        name: app.name,
        email: app.email,
        location: app.location,
        ctc: app.ctc,
        applicationStatus: app.applicationStatus,
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
      { headerName: "Name", field: "name", pinned: "left", suppressMovable: true, hide: !visibleColumns.includes("name") },
      { headerName: "Email", field: "email", pinned: "left", suppressMovable: true, hide: !visibleColumns.includes("email") },
      { headerName: "Location", field: "location", hide: !visibleColumns.includes("location") },
      { headerName: "CTC", field: "ctc", hide: !visibleColumns.includes("ctc") },
      { headerName: "Application Status", field: "applicationStatus", hide: !visibleColumns.includes("applicationStatus") },
    ];

    const skillCols = skillNames.map((skill) => ({
      headerName: skill,
      field: skill,
      cellStyle: { textAlign: "left" },
      hide: !visibleColumns.includes(skill),
    }));

    return [...staticCols, ...skillCols];
  }, [skillNames, visibleColumns]);

  const toggleColumn = (columnName: string) => {
    setVisibleColumns((prev) =>
      prev.includes(columnName) ? prev.filter((col) => col !== columnName) : [...prev, columnName]
    );
  };

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
            placeholder="Search candidates..."
            onInput={onFilterTextBoxChanged}
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="flex items-center space-x-2">
              <span>Toggle Columns</span>
              <ChevronDown className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-64 p-2">
            {staticColumns.map((column) => (
              <DropdownMenuCheckboxItem
                key={column}
                checked={visibleColumns.includes(column)}
                onCheckedChange={() => toggleColumn(column)}
              >
                {column}
              </DropdownMenuCheckboxItem>
            ))}
            <hr className="my-2" />
            {skillNames.map((skill) => (
              <DropdownMenuCheckboxItem
                key={skill}
                checked={visibleColumns.includes(skill)}
                onCheckedChange={() => toggleColumn(skill)}
              >
                {skill}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="ag-theme-alpine h-full rounded-lg shadow-sm">
        <AgGridReact
          ref={gridRef}
          rowData={rowData}
          columnDefs={colDefs}
          pagination={true}
          paginationPageSize={20}
          domLayout="autoHeight"
        />
      </div>
    </div>
  );
}
``