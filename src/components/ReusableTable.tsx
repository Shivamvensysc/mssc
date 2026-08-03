// /**
//  * ReusableTable.tsx
//  * ---------------------------------------------------------------------------
//  * A fully generic, headless-style DataTable driven entirely by props.
//  *
//  * Supports (per Standard_table_format.docx):
//  *  - Consistent typography/color across header + body (theme prop)
//  *  - Filter + Export buttons in the top-right toolbar
//  *  - Per-column sorting (numeric asc/desc, string A-Z/Z-A, date asc/desc)
//  *  - Advanced filter panel: text match, number min/max range,
//  *    date "from/to" range, dropdown (status/rating)
//  *  - Pagination (consistent shape on every table)
//  *  - Standard date formatting ("10 April, 2026" / "10 April, 2026 11:25 AM")
//  *  - Standard phone formatting (+91 default, configurable country code)
//  *
//  * Zero external UI/icon dependencies -> drop into any React + Tailwind app.
//  * ---------------------------------------------------------------------------
//  */

// import React, { useCallback, useMemo, useState } from "react";

// /* ============================================================================
//  * Types
//  * ==========================================================================*/

// export type ColumnDataType =
//   | "text"
//   | "number"
//   | "date"
//   | "datetime"
//   | "status"
//   | "badge"
//   | "link"
//   | "phone"
//   | "rating"
//   | "custom";

// type SortOrder = "asc" | "desc" | null;

// interface SortState {
//   key: string | null;
//   order: SortOrder;
// }

// type FilterKind = "text" | "numberRange" | "dateRange" | "dropdown";

// export interface FilterOverride {
//   /** Force a specific filter UI instead of the type inferred from `column.type`. */
//   kind?: FilterKind;
//   /** Explicit dropdown options. If omitted, options are derived from the data. */
//   options?: string[];
// }

// export interface Column<T> {
//   /** Property on the row this column reads/sorts/filters by. */
//   key: Extract<keyof T, string> | (string & {});
//   /** Header label. */
//   title: string;
//   /** Drives default formatting + default filter UI. Default: "text". */
//   type?: ColumnDataType;
//   /** Fixed px width, or any valid CSS width string (e.g. "20%", "12rem"). */
//   width?: number | string;
//   minWidth?: number | string;
//   align?: "left" | "center" | "right";
//   /** Default true, except for type "custom" (opt in explicitly). */
//   sortable?: boolean;
//   /** Default true, except for type "custom" (opt in explicitly). */
//   filterable?: boolean;
//   filter?: FilterOverride;
//   /** Max stars/points for type "rating". Default 5. */
//   ratingMax?: number;
//   /** Custom cell renderer. Required (recommended) for type "custom". */
//   render?: (row: T, rowIndex: number) => React.ReactNode;
//   headerClassName?: string;
//   cellClassName?: string;
// }

// export interface TableTheme {
//   fontFamily?: string;
//   cardBackground?: string;
//   borderColor?: string;
//   borderRadius?: number | string;
//   headerBackground?: string;
//   headerColor?: string;
//   headerFontSize?: number | string;
//   bodyColor?: string;
//   bodyFontSize?: number | string;
//   rowHoverBackground?: string;
//   rowHeight?: number | string;
//   accentColor?: string;
// }

// export interface PaginationConfig {
//   pageSize?: number;
//   pageSizeOptions?: number[];
// }

// export interface ToolbarConfig {
//   search?: boolean;
//   filter?: boolean;
//   export?: boolean;
//   searchPlaceholder?: string;
//   customButtons?: React.ReactNode;
// }

// export interface ReusableTableProps<T> {
//   title?: string;
//   subtitle?: string;
//   columns: Column<T>[];
//   data: T[];
//   /** Unique row identity — a key on T, or a function deriving one. */
//   rowKey: Extract<keyof T, string> | ((row: T, index: number) => string | number);

//   theme?: TableTheme;
//   toolbar?: ToolbarConfig;
//   /** Restrict global search to specific columns. Default: all filterable text-like columns. */
//   searchKeys?: Extract<keyof T, string>[];

//   pagination?: boolean | PaginationConfig;
//   loading?: boolean;
//   emptyMessage?: string;

//   onRowClick?: (row: T) => void;
//   /** Provide to override the built-in CSV export. Receives currently filtered+sorted rows. */
//   onExport?: (rows: T[]) => void;

//   /** Default country code used to format `type: "phone"` columns. Default "+91". */
//   defaultCountryCode?: string;

//   stickyHeader?: boolean;
//   className?: string;
// }

// /* ============================================================================
//  * Theme defaults — mirrors the reference design (light card, lavender header)
//  * ==========================================================================*/

// const DEFAULT_THEME: Required<TableTheme> = {
//   fontFamily:
//     "Inter, ui-sans-serif, system-ui, -apple-system, 'Segoe UI', sans-serif",
//   cardBackground: "#FFFFFF",
//   borderColor: "#E7E5F5",
//   borderRadius: 20,
//   headerBackground: "#EEF0FC",
//   headerColor: "#4B4F6B",
//   headerFontSize: 12,
//   bodyColor: "#1E2233",
//   bodyFontSize: 14,
//   rowHoverBackground: "#F7F7FD",
//   rowHeight: 64,
//   accentColor: "#6C63FF",
// };

// /* ============================================================================
//  * Small inline icons (dependency-free)
//  * ==========================================================================*/

// const IconSearch = (p: React.SVGProps<SVGSVGElement>) => (
//   <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" {...p}>
//     <circle cx="11" cy="11" r="7" />
//     <line x1="21" y1="21" x2="16.65" y2="16.65" />
//   </svg>
// );
// const IconFilter = (p: React.SVGProps<SVGSVGElement>) => (
//   <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" {...p}>
//     <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
//   </svg>
// );
// const IconDownload = (p: React.SVGProps<SVGSVGElement>) => (
//   <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" {...p}>
//     <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
//     <polyline points="7 10 12 15 17 10" />
//     <line x1="12" y1="15" x2="12" y2="3" />
//   </svg>
// );
// const IconChevronsUpDown = (p: React.SVGProps<SVGSVGElement>) => (
//   <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" {...p}>
//     <polyline points="7 15 12 20 17 15" />
//     <polyline points="7 9 12 4 17 9" />
//   </svg>
// );
// const IconChevronUp = (p: React.SVGProps<SVGSVGElement>) => (
//   <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" {...p}>
//     <polyline points="18 15 12 9 6 15" />
//   </svg>
// );
// const IconChevronDown = (p: React.SVGProps<SVGSVGElement>) => (
//   <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" {...p}>
//     <polyline points="6 9 12 15 18 9" />
//   </svg>
// );
// const IconChevronLeft = (p: React.SVGProps<SVGSVGElement>) => (
//   <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" {...p}>
//     <polyline points="15 18 9 12 15 6" />
//   </svg>
// );
// const IconChevronRight = (p: React.SVGProps<SVGSVGElement>) => (
//   <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" {...p}>
//     <polyline points="9 18 15 12 9 6" />
//   </svg>
// );
// const IconFile = (p: React.SVGProps<SVGSVGElement>) => (
//   <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" {...p}>
//     <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
//     <polyline points="14 2 14 8 20 8" />
//   </svg>
// );
// const IconX = (p: React.SVGProps<SVGSVGElement>) => (
//   <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" {...p}>
//     <line x1="18" y1="6" x2="6" y2="18" />
//     <line x1="6" y1="6" x2="18" y2="18" />
//   </svg>
// );
// const IconStar = (p: React.SVGProps<SVGSVGElement> & { filled?: boolean }) => {
//   const { filled, ...rest } = p;
//   return (
//     <svg viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth={1.5} {...rest}>
//       <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
//     </svg>
//   );
// };
// const IconInbox = (p: React.SVGProps<SVGSVGElement>) => (
//   <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" {...p}>
//     <polyline points="22 12 16 12 14 15 10 15 8 12 2 12" />
//     <path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" />
//   </svg>
// );

// /* ============================================================================
//  * Utilities
//  * ==========================================================================*/

// const cn = (...parts: Array<string | false | null | undefined>) =>
//   parts.filter(Boolean).join(" ");

// const getValue = <T,>(row: T, key: string): unknown =>
//   (row as unknown as Record<string, unknown>)[key];

// /** "10 April, 2026" or "10 April, 2026 11:25 AM" for datetime. */
// const formatDate = (value: unknown, withTime: boolean): string => {
//   if (value === null || value === undefined || value === "") return "—";
//   const d = value instanceof Date ? value : new Date(String(value));
//   if (Number.isNaN(d.getTime())) return String(value);
//   const day = d.getDate();
//   const month = d.toLocaleString("en-US", { month: "long" });
//   const year = d.getFullYear();
//   const base = `${day} ${month}, ${year}`;
//   if (!withTime) return base;
//   const time = d.toLocaleString("en-US", {
//     hour: "numeric",
//     minute: "2-digit",
//     hour12: true,
//   });
//   return `${base} ${time}`;
// };

// /** +91 98765 43210 (India default) or "+<code> <national number>" otherwise. */
// const formatPhone = (value: unknown, defaultCountryCode: string): string => {
//   if (value === null || value === undefined || value === "") return "—";
//   const raw = String(value).trim();
//   if (raw.startsWith("+")) return raw; // already formatted with a country code
//   const digits = raw.replace(/\D/g, "");
//   if (defaultCountryCode === "+91" && digits.length === 10) {
//     return `+91 ${digits.slice(0, 5)} ${digits.slice(5)}`;
//   }
//   const grouped = digits.replace(/(\d{3})(?=\d)/g, "$1 ").trim();
//   return `${defaultCountryCode} ${grouped}`;
// };

// const STATUS_TONE_MAP: Record<string, "success" | "warning" | "danger" | "neutral" | "info"> = {
//   resolved: "success",
//   active: "success",
//   approved: "success",
//   completed: "success",
//   success: "success",
//   paid: "success",
//   pending: "warning",
//   "in progress": "warning",
//   review: "warning",
//   warning: "warning",
//   failed: "danger",
//   rejected: "danger",
//   error: "danger",
//   overdue: "danger",
//   cancelled: "danger",
//   inactive: "neutral",
//   draft: "neutral",
//   new: "info",
//   info: "info",
// };

// const TONE_CLASSES: Record<string, string> = {
//   success: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
//   warning: "bg-amber-50 text-amber-700 ring-amber-600/20",
//   danger: "bg-rose-50 text-rose-700 ring-rose-600/20",
//   info: "bg-sky-50 text-sky-700 ring-sky-600/20",
//   neutral: "bg-slate-100 text-slate-600 ring-slate-500/20",
// };

// const StatusBadge: React.FC<{ value: unknown }> = ({ value }) => {
//   const label = String(value ?? "—");
//   const tone = STATUS_TONE_MAP[label.toLowerCase()] ?? "neutral";
//   return (
//     <span
//       className={cn(
//         "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset whitespace-nowrap",
//         TONE_CLASSES[tone]
//       )}
//     >
//       {label}
//     </span>
//   );
// };

// const RatingCell: React.FC<{ value: unknown; max: number }> = ({ value, max }) => {
//   const num = Number(value) || 0;
//   return (
//     <div className="flex items-center gap-0.5" aria-label={`${num} out of ${max}`}>
//       {Array.from({ length: max }).map((_, i) => (
//         <IconStar key={i} filled={i < Math.round(num)} className={cn("h-3.5 w-3.5", i < Math.round(num) ? "text-amber-400" : "text-slate-300")} />
//       ))}
//       <span className="ml-1 text-xs text-slate-500">{num}/{max}</span>
//     </div>
//   );
// };

// const LinkCell: React.FC<{ value: unknown }> = ({ value }) => {
//   if (value === null || value === undefined || value === "") return <span className="text-slate-400">—</span>;
//   const label = String(value);
//   const isUrl = /^https?:\/\//i.test(label);
//   return (
//     <a
//       href={isUrl ? label : "#"}
//       onClick={isUrl ? undefined : (e) => e.preventDefault()}
//       target={isUrl ? "_blank" : undefined}
//       rel={isUrl ? "noopener noreferrer" : undefined}
//       className="inline-flex items-center gap-1.5 text-indigo-600 hover:text-indigo-800 hover:underline"
//       title={label}
//     >
//       <IconFile className="h-4 w-4 shrink-0" />
//       <span className="truncate max-w-[10rem]">{label}</span>
//     </a>
//   );
// };

// /* ============================================================================
//  * Filter panel field types
//  * ==========================================================================*/

// type NumberRangeValue = { min?: string; max?: string };
// type DateRangeValue = { from?: string; to?: string };
// type FilterValue = string | NumberRangeValue | DateRangeValue | undefined;
// type FiltersState = Record<string, FilterValue>;

// const inferFilterKind = <T,>(col: Column<T>): FilterKind => {
//   if (col.filter?.kind) return col.filter.kind;
//   switch (col.type) {
//     case "number":
//       return "numberRange";
//     case "date":
//     case "datetime":
//       return "dateRange";
//     case "status":
//     case "badge":
//     case "rating":
//       return "dropdown";
//     default:
//       return "text";
//   }
// };

// const isDefaultSortable = (type: ColumnDataType | undefined) => type !== "custom";
// const isDefaultFilterable = (type: ColumnDataType | undefined) => type !== "custom";

// /* ============================================================================
//  * Component
//  * ==========================================================================*/

// function ReusableTableInner<T extends object>(props: ReusableTableProps<T>) {
//   const {
//     title,
//     subtitle,
//     columns,
//     data,
//     rowKey,
//     theme,
//     toolbar,
//     searchKeys,
//     pagination = true,
//     loading = false,
//     emptyMessage = "No records to show yet.",
//     onRowClick,
//     onExport,
//     defaultCountryCode = "+91",
//     stickyHeader = true,
//     className,
//   } = props;

//   const t: Required<TableTheme> = { ...DEFAULT_THEME, ...theme };

//   const showSearch = toolbar?.search ?? true;
//   const showFilter = toolbar?.filter ?? true;
//   const showExport = toolbar?.export ?? true;

//   const paginationConfig: Required<PaginationConfig> | null = pagination
//     ? {
//         pageSize: (typeof pagination === "object" && pagination.pageSize) || 10,
//         pageSizeOptions: (typeof pagination === "object" && pagination.pageSizeOptions) || [10, 20, 50, 100],
//       }
//     : null;

//   const [searchText, setSearchText] = useState("");
//   const [sort, setSort] = useState<SortState>({ key: null, order: null });
//   const [filters, setFilters] = useState<FiltersState>({});
//   const [filterPanelOpen, setFilterPanelOpen] = useState(false);
//   const [page, setPage] = useState(1);
//   const [pageSize, setPageSize] = useState(paginationConfig?.pageSize ?? 10);

//   const getRowKey = useCallback(
//     (row: T, index: number): string | number =>
//       typeof rowKey === "function" ? rowKey(row, index) : (getValue(row, rowKey as string) as string | number) ?? index,
//     [rowKey]
//   );

//   /* ---- derive dropdown option lists straight from the data ---- */
//   const dropdownOptions = useMemo(() => {
//     const map: Record<string, string[]> = {};
//     columns.forEach((col) => {
//       if (inferFilterKind(col) !== "dropdown") return;
//       if (col.filter?.options) {
//         map[col.key] = col.filter.options;
//         return;
//       }
//       const unique = new Set<string>();
//       data.forEach((row) => {
//         const v = getValue(row, col.key);
//         if (v !== null && v !== undefined && v !== "") unique.add(String(v));
//       });
//       map[col.key] = Array.from(unique).sort();
//     });
//     return map;
//   }, [columns, data]);

//   /* ---- global search ---- */
//   const effectiveSearchKeys = useMemo<string[]>(() => {
//     if (searchKeys?.length) return searchKeys;
//     return columns.filter((c) => (c.filterable ?? isDefaultFilterable(c.type)) && c.type !== "custom").map((c) => c.key);
//   }, [searchKeys, columns]);

//   const searched = useMemo(() => {
//     if (!searchText.trim()) return data;
//     const needle = searchText.trim().toLowerCase();
//     return data.filter((row) =>
//       effectiveSearchKeys.some((key) => String(getValue(row, key) ?? "").toLowerCase().includes(needle))
//     );
//   }, [data, searchText, effectiveSearchKeys]);

//   /* ---- advanced filters ---- */
//   const filtered = useMemo(() => {
//     const activeEntries = Object.entries(filters).filter(([, v]) => {
//       if (v === undefined || v === null) return false;
//       if (typeof v === "string") return v.trim() !== "";
//       if ("min" in v || "max" in v) return !!(v.min || v.max);
//       if ("from" in v || "to" in v) return !!(v.from || v.to);
//       return false;
//     });
//     if (activeEntries.length === 0) return searched;

//     return searched.filter((row) =>
//       activeEntries.every(([key, value]) => {
//         const col = columns.find((c) => c.key === key);
//         const kind = col ? inferFilterKind(col) : "text";
//         const raw = getValue(row, key);

//         if (kind === "numberRange" && typeof value === "object" && value && "min" in value) {
//           const num = Number(raw);
//           const { min, max } = value as NumberRangeValue;
//           if (min !== undefined && min !== "" && num < Number(min)) return false;
//           if (max !== undefined && max !== "" && num > Number(max)) return false;
//           return true;
//         }

//         if (kind === "dateRange" && typeof value === "object" && value && "from" in value) {
//           const d = raw instanceof Date ? raw : new Date(String(raw));
//           const { from, to } = value as DateRangeValue;
//           if (from && d < new Date(from)) return false;
//           if (to && d > new Date(`${to}T23:59:59`)) return false;
//           return true;
//         }

//         if (kind === "dropdown" && typeof value === "string") {
//           return String(raw ?? "") === value;
//         }

//         // text
//         if (typeof value === "string") {
//           return String(raw ?? "").toLowerCase().includes(value.toLowerCase());
//         }
//         return true;
//       })
//     );
//   }, [searched, filters, columns]);

//   /* ---- sorting ---- */
//   const sorted = useMemo(() => {
//     if (!sort.key || !sort.order) return filtered;
//     const col = columns.find((c) => c.key === sort.key);
//     const dir = sort.order === "asc" ? 1 : -1;

//     return [...filtered].sort((a, b) => {
//       const av = getValue(a, sort.key as string);
//       const bv = getValue(b, sort.key as string);

//       if (col?.type === "number" || col?.type === "rating") {
//         return ((Number(av) || 0) - (Number(bv) || 0)) * dir;
//       }
//       if (col?.type === "date" || col?.type === "datetime") {
//         const ad = av instanceof Date ? av : new Date(String(av));
//         const bd = bv instanceof Date ? bv : new Date(String(bv));
//         return (ad.getTime() - bd.getTime()) * dir;
//       }
//       return String(av ?? "").localeCompare(String(bv ?? ""), undefined, { numeric: true }) * dir;
//     });
//   }, [filtered, sort, columns]);

//   /* ---- pagination ---- */
//   const totalRows = sorted.length;
//   const totalPages = paginationConfig ? Math.max(1, Math.ceil(totalRows / pageSize)) : 1;
//   const safePage = Math.min(page, totalPages);
//   const pageRows = useMemo(() => {
//     if (!paginationConfig) return sorted;
//     const start = (safePage - 1) * pageSize;
//     return sorted.slice(start, start + pageSize);
//   }, [sorted, safePage, pageSize, paginationConfig]);

//   /* ---- handlers ---- */
//   const toggleSort = (col: Column<T>) => {
//     const sortable = col.sortable ?? isDefaultSortable(col.type);
//     if (!sortable) return;
//     setSort((prev) => {
//       if (prev.key !== col.key) return { key: col.key, order: "asc" };
//       if (prev.order === "asc") return { key: col.key, order: "desc" };
//       return { key: null, order: null };
//     });
//   };

//   const updateFilter = (key: string, value: FilterValue) => {
//     setFilters((prev) => ({ ...prev, [key]: value }));
//     setPage(1);
//   };

//   const clearFilters = () => {
//     setFilters({});
//     setPage(1);
//   };

//   const activeFilterCount = Object.values(filters).filter((v) => {
//     if (v === undefined || v === null) return false;
//     if (typeof v === "string") return v.trim() !== "";
//     if ("min" in v || "max" in v) return !!(v.min || v.max);
//     if ("from" in v || "to" in v) return !!(v.from || v.to);
//     return false;
//   }).length;

//   const exportCsv = () => {
//     if (onExport) return onExport(sorted);
//     const headers = columns.filter((c) => c.type !== "custom").map((c) => c.title);
//     const keys = columns.filter((c) => c.type !== "custom").map((c) => c.key);
//     const rows = sorted.map((row) =>
//       keys
//         .map((k) => {
//           const v = getValue(row, k);
//           const str = v === null || v === undefined ? "" : String(v);
//           return `"${str.replace(/"/g, '""')}"`;
//         })
//         .join(",")
//     );
//     const csv = [headers.join(","), ...rows].join("\n");
//     const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
//     const url = URL.createObjectURL(blob);
//     const a = document.createElement("a");
//     a.href = url;
//     a.download = `${(title || "table-export").toLowerCase().replace(/\s+/g, "-")}.csv`;
//     a.click();
//     URL.revokeObjectURL(url);
//   };

//   /* ---- default cell renderer per column type ---- */
//   const renderCell = (col: Column<T>, row: T, rowIndex: number): React.ReactNode => {
//     if (col.render) return col.render(row, rowIndex);
//     const value = getValue(row, col.key);
//     switch (col.type) {
//       case "date":
//         return formatDate(value, false);
//       case "datetime":
//         return formatDate(value, true);
//       case "phone":
//         return formatPhone(value, defaultCountryCode);
//       case "status":
//       case "badge":
//         return <StatusBadge value={value} />;
//       case "rating":
//         return <RatingCell value={value} max={col.ratingMax ?? 5} />;
//       case "link":
//         return <LinkCell value={value} />;
//       case "number":
//         return value === null || value === undefined || value === "" ? "—" : Number(value).toLocaleString();
//       default:
//         return value === null || value === undefined || value === "" ? "—" : String(value);
//     }
//   };

//   /* ==========================================================================
//    * Render
//    * ========================================================================*/

//   return (
//     <div
//       className={cn("w-full", className)}
//       style={{
//         fontFamily: t.fontFamily,
//         background: t.cardBackground,
//         borderRadius: t.borderRadius,
//         border: `1px solid ${t.borderColor}`,
//       }}
//     >
//       {/* ---------------- Header / Toolbar ---------------- */}
//       {(title || subtitle || showSearch || showFilter || showExport || toolbar?.customButtons) && (
//         <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
//           {(title || subtitle) && (
//             <div className="min-w-0">
//               {title && (
//                 <h3 className="truncate text-base font-semibold" style={{ color: t.bodyColor }}>
//                   {title}
//                 </h3>
//               )}
//               {subtitle && <p className="mt-0.5 truncate text-sm text-slate-500">{subtitle}</p>}
//             </div>
//           )}

//           <div className="flex flex-wrap items-center gap-2 sm:shrink-0">
//             {showSearch && (
//               <div className="relative">
//                 <IconSearch className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
//                 <input
//                   type="text"
//                   value={searchText}
//                   onChange={(e) => {
//                     setSearchText(e.target.value);
//                     setPage(1);
//                   }}
//                   placeholder={toolbar?.searchPlaceholder ?? "Search..."}
//                   className="h-10 w-full min-w-[10rem] rounded-xl border border-slate-200 bg-white pl-9 pr-3 text-sm text-slate-700 placeholder:text-slate-400 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100 sm:w-56"
//                 />
//               </div>
//             )}

//             {showFilter && (
//               <div className="relative">
//                 <button
//                   type="button"
//                   onClick={() => setFilterPanelOpen((o) => !o)}
//                   className={cn(
//                     "inline-flex h-10 items-center gap-2 rounded-xl border px-3.5 text-sm font-medium transition-colors",
//                     activeFilterCount > 0
//                       ? "border-indigo-200 bg-indigo-50 text-indigo-700"
//                       : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
//                   )}
//                 >
//                   <IconFilter className="h-4 w-4" />
//                   Filters
//                   {activeFilterCount > 0 && (
//                     <span className="inline-flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-indigo-600 px-1 text-xs font-semibold text-white">
//                       {activeFilterCount}
//                     </span>
//                   )}
//                 </button>

//                 {filterPanelOpen && (
//                   <FilterPanel
//                     columns={columns}
//                     filters={filters}
//                     dropdownOptions={dropdownOptions}
//                     onChange={updateFilter}
//                     onClear={clearFilters}
//                     onClose={() => setFilterPanelOpen(false)}
//                   />
//                 )}
//               </div>
//             )}

//             {showExport && (
//               <button
//                 type="button"
//                 onClick={exportCsv}
//                 className="inline-flex h-10 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 text-sm font-medium text-slate-600 hover:bg-slate-50"
//               >
//                 <IconDownload className="h-4 w-4" />
//                 Export
//               </button>
//             )}

//             {toolbar?.customButtons}
//           </div>
//         </div>
//       )}

//       {/* ---------------- Table ---------------- */}
//       <div className="w-full overflow-x-auto">
//         <table className="w-full min-w-[640px] border-collapse text-left" style={{ fontSize: t.bodyFontSize }}>
//           <thead className={cn(stickyHeader && "sticky top-0 z-10")} style={{ background: t.headerBackground }}>
//             <tr>
//               {columns.map((col) => {
//                 const sortable = col.sortable ?? isDefaultSortable(col.type);
//                 const active = sort.key === col.key;
//                 return (
//                   <th
//                     key={col.key}
//                     onClick={() => toggleSort(col)}
//                     className={cn(
//                       "select-none whitespace-nowrap px-4 py-3 font-semibold uppercase tracking-wide",
//                       sortable && "cursor-pointer",
//                       col.align === "right" && "text-right",
//                       col.align === "center" && "text-center",
//                       col.headerClassName
//                     )}
//                     style={{
//                       color: t.headerColor,
//                       fontSize: t.headerFontSize,
//                       width: col.width,
//                       minWidth: col.minWidth,
//                     }}
//                   >
//                     <span className={cn("inline-flex items-center gap-1", col.align === "right" && "flex-row-reverse")}>
//                       {col.title}
//                       {sortable &&
//                         (active && sort.order === "asc" ? (
//                           <IconChevronUp className="h-3.5 w-3.5 text-indigo-600" />
//                         ) : active && sort.order === "desc" ? (
//                           <IconChevronDown className="h-3.5 w-3.5 text-indigo-600" />
//                         ) : (
//                           <IconChevronsUpDown className="h-3.5 w-3.5 text-slate-400" />
//                         ))}
//                     </span>
//                   </th>
//                 );
//               })}
//             </tr>
//           </thead>

//           <tbody>
//             {loading ? (
//               Array.from({ length: Math.min(pageSize, 6) }).map((_, i) => (
//                 <tr key={`skeleton-${i}`} className="border-t" style={{ borderColor: t.borderColor }}>
//                   {columns.map((col) => (
//                     <td key={col.key} className="px-4 py-4">
//                       <div className="h-3.5 w-3/4 animate-pulse rounded bg-slate-200" />
//                     </td>
//                   ))}
//                 </tr>
//               ))
//             ) : pageRows.length === 0 ? (
//               <tr>
//                 <td colSpan={columns.length} className="px-4 py-16">
//                   <div className="flex flex-col items-center justify-center gap-2 text-slate-400">
//                     <IconInbox className="h-10 w-10" />
//                     <p className="text-sm font-medium text-slate-500">{emptyMessage}</p>
//                   </div>
//                 </td>
//               </tr>
//             ) : (
//               pageRows.map((row, i) => (
//                 <tr
//                   key={getRowKey(row, i)}
//                   onClick={() => onRowClick?.(row)}
//                   className={cn("border-t transition-colors", onRowClick && "cursor-pointer")}
//                   style={{ borderColor: t.borderColor, height: t.rowHeight }}
//                   onMouseEnter={(e) => (e.currentTarget.style.background = t.rowHoverBackground)}
//                   onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
//                 >
//                   {columns.map((col) => (
//                     <td
//                       key={col.key}
//                       className={cn(
//                         "px-4 py-3 align-middle",
//                         col.align === "right" && "text-right",
//                         col.align === "center" && "text-center",
//                         col.cellClassName
//                       )}
//                       style={{ color: t.bodyColor }}
//                     >
//                       {renderCell(col, row, i)}
//                     </td>
//                   ))}
//                 </tr>
//               ))
//             )}
//           </tbody>
//         </table>
//       </div>

//       {/* ---------------- Pagination ---------------- */}
//       {paginationConfig && !loading && totalRows > 0 && (
//         <PaginationBar
//           page={safePage}
//           totalPages={totalPages}
//           totalRows={totalRows}
//           pageSize={pageSize}
//           pageSizeOptions={paginationConfig.pageSizeOptions}
//           onPageChange={setPage}
//           onPageSizeChange={(size) => {
//             setPageSize(size);
//             setPage(1);
//           }}
//           accentColor={t.accentColor}
//           borderColor={t.borderColor}
//         />
//       )}
//     </div>
//   );
// }

// /* ============================================================================
//  * Filter panel subcomponent
//  * ==========================================================================*/

// function FilterPanel<T>({
//   columns,
//   filters,
//   dropdownOptions,
//   onChange,
//   onClear,
//   onClose,
// }: {
//   columns: Column<T>[];
//   filters: FiltersState;
//   dropdownOptions: Record<string, string[]>;
//   onChange: (key: string, value: FilterValue) => void;
//   onClear: () => void;
//   onClose: () => void;
// }) {
//   const filterableColumns = columns.filter((c) => c.filterable ?? isDefaultFilterable(c.type));

//   return (
//     <div className="absolute right-0 z-20 mt-2 w-80 max-w-[90vw] rounded-2xl border border-slate-200 bg-white p-4 shadow-xl">
//       <div className="mb-3 flex items-center justify-between">
//         <p className="text-sm font-semibold text-slate-700">Advanced filters</p>
//         <button onClick={onClose} className="rounded-md p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600">
//           <IconX className="h-4 w-4" />
//         </button>
//       </div>

//       <div className="max-h-80 space-y-4 overflow-y-auto pr-1">
//         {filterableColumns.map((col) => {
//           const kind = inferFilterKind(col);
//           const value = filters[col.key];

//           if (kind === "numberRange") {
//             const v = (value as NumberRangeValue) || {};
//             return (
//               <div key={col.key}>
//                 <label className="mb-1 block text-xs font-medium text-slate-500">{col.title}</label>
//                 <div className="flex items-center gap-2">
//                   <input
//                     type="number"
//                     placeholder="Min"
//                     value={v.min ?? ""}
//                     onChange={(e) => onChange(col.key, { ...v, min: e.target.value })}
//                     className="h-9 w-full rounded-lg border border-slate-200 px-2.5 text-sm focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100"
//                   />
//                   <span className="text-slate-400">–</span>
//                   <input
//                     type="number"
//                     placeholder="Max"
//                     value={v.max ?? ""}
//                     onChange={(e) => onChange(col.key, { ...v, max: e.target.value })}
//                     className="h-9 w-full rounded-lg border border-slate-200 px-2.5 text-sm focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100"
//                   />
//                 </div>
//               </div>
//             );
//           }

//           if (kind === "dateRange") {
//             const v = (value as DateRangeValue) || {};
//             return (
//               <div key={col.key}>
//                 <label className="mb-1 block text-xs font-medium text-slate-500">{col.title}</label>
//                 <div className="flex items-center gap-2">
//                   <input
//                     type="date"
//                     value={v.from ?? ""}
//                     onChange={(e) => onChange(col.key, { ...v, from: e.target.value })}
//                     className="h-9 w-full rounded-lg border border-slate-200 px-2.5 text-sm focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100"
//                   />
//                   <span className="text-slate-400">–</span>
//                   <input
//                     type="date"
//                     value={v.to ?? ""}
//                     onChange={(e) => onChange(col.key, { ...v, to: e.target.value })}
//                     className="h-9 w-full rounded-lg border border-slate-200 px-2.5 text-sm focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100"
//                   />
//                 </div>
//               </div>
//             );
//           }

//           if (kind === "dropdown") {
//             const options = dropdownOptions[col.key] || [];
//             return (
//               <div key={col.key}>
//                 <label className="mb-1 block text-xs font-medium text-slate-500">{col.title}</label>
//                 <select
//                   value={(value as string) ?? ""}
//                   onChange={(e) => onChange(col.key, e.target.value || undefined)}
//                   className="h-9 w-full rounded-lg border border-slate-200 bg-white px-2.5 text-sm focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100"
//                 >
//                   <option value="">All</option>
//                   {options.map((opt) => (
//                     <option key={opt} value={opt}>
//                       {opt}
//                     </option>
//                   ))}
//                 </select>
//               </div>
//             );
//           }

//           // text
//           return (
//             <div key={col.key}>
//               <label className="mb-1 block text-xs font-medium text-slate-500">{col.title}</label>
//               <input
//                 type="text"
//                 placeholder={`Search ${col.title.toLowerCase()}`}
//                 value={(value as string) ?? ""}
//                 onChange={(e) => onChange(col.key, e.target.value || undefined)}
//                 className="h-9 w-full rounded-lg border border-slate-200 px-2.5 text-sm focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100"
//               />
//             </div>
//           );
//         })}
//       </div>

//       <button
//         onClick={onClear}
//         className="mt-4 w-full rounded-lg border border-slate-200 py-2 text-sm font-medium text-slate-500 hover:bg-slate-50"
//       >
//         Clear all filters
//       </button>
//     </div>
//   );
// }

// /* ============================================================================
//  * Pagination subcomponent
//  * ==========================================================================*/

// function PaginationBar({
//   page,
//   totalPages,
//   totalRows,
//   pageSize,
//   pageSizeOptions,
//   onPageChange,
//   onPageSizeChange,
//   accentColor,
//   borderColor,
// }: {
//   page: number;
//   totalPages: number;
//   totalRows: number;
//   pageSize: number;
//   pageSizeOptions: number[];
//   onPageChange: (page: number) => void;
//   onPageSizeChange: (size: number) => void;
//   accentColor: string;
//   borderColor: string;
// }) {
//   const start = (page - 1) * pageSize + 1;
//   const end = Math.min(page * pageSize, totalRows);

//   const pageNumbers = useMemo(() => {
//     const nums: (number | "...")[] = [];
//     const windowSize = 1;
//     for (let i = 1; i <= totalPages; i++) {
//       if (i === 1 || i === totalPages || Math.abs(i - page) <= windowSize) {
//         nums.push(i);
//       } else if (nums[nums.length - 1] !== "...") {
//         nums.push("...");
//       }
//     }
//     return nums;
//   }, [page, totalPages]);

//   return (
//     <div
//       className="flex flex-col gap-3 border-t px-5 py-4 sm:flex-row sm:items-center sm:justify-between"
//       style={{ borderColor }}
//     >
//       <div className="flex items-center gap-2 text-sm text-slate-500">
//         <span>
//           Showing <span className="font-medium text-slate-700">{start}</span>–
//           <span className="font-medium text-slate-700">{end}</span> of{" "}
//           <span className="font-medium text-slate-700">{totalRows}</span>
//         </span>
//         <select
//           value={pageSize}
//           onChange={(e) => onPageSizeChange(Number(e.target.value))}
//           className="ml-2 h-8 rounded-lg border border-slate-200 bg-white px-2 text-sm focus:outline-none"
//         >
//           {pageSizeOptions.map((size) => (
//             <option key={size} value={size}>
//               {size} / page
//             </option>
//           ))}
//         </select>
//       </div>

//       <div className="flex items-center gap-1">
//         <button
//           onClick={() => onPageChange(Math.max(1, page - 1))}
//           disabled={page === 1}
//           className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-500 disabled:opacity-40"
//         >
//           <IconChevronLeft className="h-4 w-4" />
//         </button>

//         {pageNumbers.map((n, i) =>
//           n === "..." ? (
//             <span key={`ellipsis-${i}`} className="px-1 text-sm text-slate-400">
//               …
//             </span>
//           ) : (
//             <button
//               key={n}
//               onClick={() => onPageChange(n)}
//               className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-sm font-medium"
//               style={
//                 n === page
//                   ? { background: accentColor, color: "#fff" }
//                   : { color: "#64748b" }
//               }
//             >
//               {n}
//             </button>
//           )
//         )}

//         <button
//           onClick={() => onPageChange(Math.min(totalPages, page + 1))}
//           disabled={page === totalPages}
//           className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-500 disabled:opacity-40"
//         >
//           <IconChevronRight className="h-4 w-4" />
//         </button>
//       </div>
//     </div>
//   );
// }

// /**
//  * Exported as a plain generic function (not React.memo) so TypeScript keeps
//  * full generic inference at call sites — e.g. <ReusableTable<Feedback> ... />.
//  */
// export const ReusableTable = ReusableTableInner;
// export default ReusableTable;



/**
 * ReusableTable.tsx
 * ---------------------------------------------------------------------------
 * A fully generic, headless-style DataTable driven entirely by props.
 *
 * Supports (per Standard_table_format.docx):
 *  - Consistent typography/color across header + body (theme prop)
 *  - Filter + Export buttons in the top-right toolbar
 *  - Per-column sorting (numeric asc/desc, string A-Z/Z-A, date asc/desc)
 *  - Advanced filter panel: text match, number min/max range,
 *    date "from/to" range, dropdown (status/rating)
 *  - Pagination (consistent shape on every table, supports client & server side)
 *  - Standard date formatting ("10 April, 2026" / "10 April, 2026 11:25 AM")
 *  - Standard phone formatting (+91 default, configurable country code)
 *
 * Zero external UI/icon dependencies -> drop into any React + Tailwind app.
 * ---------------------------------------------------------------------------
 */

import React, { useCallback, useMemo, useState } from "react";

/* ============================================================================
 * Types
 * ==========================================================================*/

export type ColumnDataType =
  | "text"
  | "number"
  | "date"
  | "datetime"
  | "status"
  | "badge"
  | "link"
  | "phone"
  | "rating"
  | "custom";

type SortOrder = "asc" | "desc" | null;

interface SortState {
  key: string | null;
  order: SortOrder;
}

type FilterKind = "text" | "numberRange" | "dateRange" | "dropdown";

export interface FilterOverride {
  /** Force a specific filter UI instead of the type inferred from `column.type`. */
  kind?: FilterKind;
  /** Explicit dropdown options. If omitted, options are derived from the data. */
  options?: string[];
}

export interface Column<T> {
  /** Property on the row this column reads/sorts/filters by. */
  key: Extract<keyof T, string> | (string & {});
  /** Header label. */
  title: string;
  /** Drives default formatting + default filter UI. Default: "text". */
  type?: ColumnDataType;
  /** Fixed px width, or any valid CSS width string (e.g. "20%", "12rem"). */
  width?: number | string;
  minWidth?: number | string;
  align?: "left" | "center" | "right";
  /** Default true, except for type "custom" (opt in explicitly). */
  sortable?: boolean;
  /** Default true, except for type "custom" (opt in explicitly). */
  filterable?: boolean;
  filter?: FilterOverride;
  /** Max stars/points for type "rating". Default 5. */
  ratingMax?: number;
  /** Custom cell renderer. Required (recommended) for type "custom". */
  render?: (row: T, rowIndex: number) => React.ReactNode;
  headerClassName?: string;
  cellClassName?: string;
}

export interface TableTheme {
  fontFamily?: string;
  cardBackground?: string;
  borderColor?: string;
  borderRadius?: number | string;
  headerBackground?: string;
  headerColor?: string;
  headerFontSize?: number | string;
  bodyColor?: string;
  bodyFontSize?: number | string;
  rowHoverBackground?: string;
  rowHeight?: number | string;
  accentColor?: string;
}

export interface PaginationConfig {
  pageSize?: number;
  pageSizeOptions?: number[];
  // Props to support server-side pagination:
  currentPage?: number;
  totalRows?: number;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
}

export interface ToolbarConfig {
  search?: boolean;
  filter?: boolean;
  export?: boolean;
  searchPlaceholder?: string;
  customButtons?: React.ReactNode;
}

export interface ReusableTableProps<T> {
  title?: string;
  subtitle?: string;
  columns: Column<T>[];
  data: T[];
  /** Unique row identity — a key on T, or a function deriving one. */
  rowKey: Extract<keyof T, string> | ((row: T, index: number) => string | number);

  theme?: TableTheme;
  toolbar?: ToolbarConfig;
  /** Restrict global search to specific columns. Default: all filterable text-like columns. */
  searchKeys?: Extract<keyof T, string>[];

  pagination?: boolean | PaginationConfig;
  loading?: boolean;
  emptyMessage?: string;

  onRowClick?: (row: T) => void;
  /** Provide to override the built-in CSV export. Receives currently filtered+sorted rows. */
  onExport?: (rows: T[]) => void;

  /** Default country code used to format `type: "phone"` columns. Default "+91". */
  defaultCountryCode?: string;

  stickyHeader?: boolean;
  className?: string;
}

/* ============================================================================
 * Theme defaults — mirrors the reference design (light card, lavender header)
 * ==========================================================================*/

const DEFAULT_THEME: Required<TableTheme> = {
  fontFamily:
    "Inter, ui-sans-serif, system-ui, -apple-system, 'Segoe UI', sans-serif",
  cardBackground: "#FFFFFF",
  borderColor: "#E7E5F5",
  borderRadius: 20,
  headerBackground: "#EEF0FC",
  headerColor: "#4B4F6B",
  headerFontSize: 12,
  bodyColor: "#1E2233",
  bodyFontSize: 14,
  rowHoverBackground: "#F7F7FD",
  rowHeight: 64,
  accentColor: "#6C63FF",
};

/* ============================================================================
 * Small inline icons (dependency-free)
 * ==========================================================================*/

const IconSearch = (p: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" {...p}>
    <circle cx="11" cy="11" r="7" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);
const IconFilter = (p: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" {...p}>
    <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
  </svg>
);
const IconDownload = (p: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" {...p}>
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="7 10 12 15 17 10" />
    <line x1="12" y1="15" x2="12" y2="3" />
  </svg>
);
const IconChevronsUpDown = (p: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" {...p}>
    <polyline points="7 15 12 20 17 15" />
    <polyline points="7 9 12 4 17 9" />
  </svg>
);
const IconChevronUp = (p: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" {...p}>
    <polyline points="18 15 12 9 6 15" />
  </svg>
);
const IconChevronDown = (p: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" {...p}>
    <polyline points="6 9 12 15 18 9" />
  </svg>
);
const IconChevronLeft = (p: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" {...p}>
    <polyline points="15 18 9 12 15 6" />
  </svg>
);
const IconChevronRight = (p: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" {...p}>
    <polyline points="9 18 15 12 9 6" />
  </svg>
);
const IconFile = (p: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" {...p}>
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
  </svg>
);
const IconX = (p: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" {...p}>
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);
const IconStar = (p: React.SVGProps<SVGSVGElement> & { filled?: boolean }) => {
  const { filled, ...rest } = p;
  return (
    <svg viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth={1.5} {...rest}>
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
};
const IconInbox = (p: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" {...p}>
    <polyline points="22 12 16 12 14 15 10 15 8 12 2 12" />
    <path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" />
  </svg>
);

/* ============================================================================
 * Utilities
 * ==========================================================================*/

const cn = (...parts: Array<string | false | null | undefined>) =>
  parts.filter(Boolean).join(" ");

const getValue = <T,>(row: T, key: string): unknown =>
  (row as unknown as Record<string, unknown>)[key];

/** "10 April, 2026" or "10 April, 2026 11:25 AM" for datetime. */
const formatDate = (value: unknown, withTime: boolean): string => {
  if (value === null || value === undefined || value === "") return "—";
  const d = value instanceof Date ? value : new Date(String(value));
  if (Number.isNaN(d.getTime())) return String(value);
  const day = d.getDate();
  const month = d.toLocaleString("en-US", { month: "long" });
  const year = d.getFullYear();
  const base = `${day} ${month}, ${year}`;
  if (!withTime) return base;
  const time = d.toLocaleString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
  return `${base} ${time}`;
};

/** +91 98765 43210 (India default) or "+<code> <national number>" otherwise. */
const formatPhone = (value: unknown, defaultCountryCode: string): string => {
  if (value === null || value === undefined || value === "") return "—";
  const raw = String(value).trim();
  if (raw.startsWith("+")) return raw; // already formatted with a country code
  const digits = raw.replace(/\D/g, "");
  if (defaultCountryCode === "+91" && digits.length === 10) {
    return `+91 ${digits.slice(0, 5)} ${digits.slice(5)}`;
  }
  const grouped = digits.replace(/(\d{3})(?=\d)/g, "$1 ").trim();
  return `${defaultCountryCode} ${grouped}`;
};

const STATUS_TONE_MAP: Record<string, "success" | "warning" | "danger" | "neutral" | "info"> = {
  resolved: "success",
  active: "success",
  approved: "success",
  completed: "success",
  success: "success",
  paid: "success",
  pending: "warning",
  "in progress": "warning",
  review: "warning",
  warning: "warning",
  failed: "danger",
  rejected: "danger",
  error: "danger",
  overdue: "danger",
  cancelled: "danger",
  inactive: "neutral",
  draft: "neutral",
  new: "info",
  info: "info",
};

const TONE_CLASSES: Record<string, string> = {
  success: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
  warning: "bg-amber-50 text-amber-700 ring-amber-600/20",
  danger: "bg-rose-50 text-rose-700 ring-rose-600/20",
  info: "bg-sky-50 text-sky-700 ring-sky-600/20",
  neutral: "bg-slate-100 text-slate-600 ring-slate-500/20",
};

const StatusBadge: React.FC<{ value: unknown }> = ({ value }) => {
  const label = String(value ?? "—");
  const tone = STATUS_TONE_MAP[label.toLowerCase()] ?? "neutral";
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset whitespace-nowrap",
        TONE_CLASSES[tone]
      )}
    >
      {label}
    </span>
  );
};

const RatingCell: React.FC<{ value: unknown; max: number }> = ({ value, max }) => {
  const num = Number(value) || 0;
  return (
    <div className="flex items-center gap-0.5" aria-label={`${num} out of ${max}`}>
      {Array.from({ length: max }).map((_, i) => (
        <IconStar key={i} filled={i < Math.round(num)} className={cn("h-3.5 w-3.5", i < Math.round(num) ? "text-amber-400" : "text-slate-300")} />
      ))}
      <span className="ml-1 text-xs text-slate-500">{num}/{max}</span>
    </div>
  );
};

const LinkCell: React.FC<{ value: unknown }> = ({ value }) => {
  if (value === null || value === undefined || value === "") return <span className="text-slate-400">—</span>;
  const label = String(value);
  const isUrl = /^https?:\/\//i.test(label);
  return (
    <a
      href={isUrl ? label : "#"}
      onClick={isUrl ? undefined : (e) => e.preventDefault()}
      target={isUrl ? "_blank" : undefined}
      rel={isUrl ? "noopener noreferrer" : undefined}
      className="inline-flex items-center gap-1.5 text-indigo-600 hover:text-indigo-800 hover:underline"
      title={label}
    >
      <IconFile className="h-4 w-4 shrink-0" />
      <span className="truncate max-w-[10rem]">{label}</span>
    </a>
  );
};

/* ============================================================================
 * Filter panel field types
 * ==========================================================================*/

type NumberRangeValue = { min?: string; max?: string };
type DateRangeValue = { from?: string; to?: string };
type FilterValue = string | NumberRangeValue | DateRangeValue | undefined;
type FiltersState = Record<string, FilterValue>;

const inferFilterKind = <T,>(col: Column<T>): FilterKind => {
  if (col.filter?.kind) return col.filter.kind;
  switch (col.type) {
    case "number":
      return "numberRange";
    case "date":
    case "datetime":
      return "dateRange";
    case "status":
    case "badge":
    case "rating":
      return "dropdown";
    default:
      return "text";
  }
};

const isDefaultSortable = (type: ColumnDataType | undefined) => type !== "custom";
const isDefaultFilterable = (type: ColumnDataType | undefined) => type !== "custom";

/* ============================================================================
 * Component
 * ==========================================================================*/

function ReusableTableInner<T extends object>(props: ReusableTableProps<T>) {
  const {
    title,
    subtitle,
    columns,
    data,
    rowKey,
    theme,
    toolbar,
    searchKeys,
    pagination = true,
    loading = false,
    emptyMessage = "No records to show yet.",
    onRowClick,
    onExport,
    defaultCountryCode = "+91",
    stickyHeader = true,
    className,
  } = props;

  const t: Required<TableTheme> = { ...DEFAULT_THEME, ...theme };

  const showSearch = toolbar?.search ?? true;
  const showFilter = toolbar?.filter ?? true;
  const showExport = toolbar?.export ?? true;

  const paginationConfig: PaginationConfig | null = 
    typeof pagination === "object" ? pagination : pagination ? {} : null;

  const [searchText, setSearchText] = useState("");
  const [sort, setSort] = useState<SortState>({ key: null, order: null });
  const [filters, setFilters] = useState<FiltersState>({});
  const [filterPanelOpen, setFilterPanelOpen] = useState(false);
  
  // Client-side state (used if server-side is not active)
  const [clientPage, setClientPage] = useState(1);
  const [clientPageSize, setClientPageSize] = useState(paginationConfig?.pageSize ?? 10);

  // Determine if we are doing server-side pagination based on the presence of totalRows
  const isServerSide = paginationConfig !== null && paginationConfig.totalRows !== undefined;

  const effectivePage = isServerSide ? (paginationConfig?.currentPage || 1) : clientPage;
  const effectivePageSize = isServerSide ? (paginationConfig?.pageSize || 10) : clientPageSize;

  const handlePageChange = (newPage: number) => {
    if (isServerSide && paginationConfig?.onPageChange) {
      paginationConfig.onPageChange(newPage);
    } else {
      setClientPage(newPage);
    }
  };

  const handlePageSizeChange = (newSize: number) => {
    if (isServerSide && paginationConfig?.onPageSizeChange) {
      paginationConfig.onPageSizeChange(newSize);
    } else {
      setClientPageSize(newSize);
      setClientPage(1);
    }
  };

  const getRowKey = useCallback(
    (row: T, index: number): string | number =>
      typeof rowKey === "function" ? rowKey(row, index) : (getValue(row, rowKey as string) as string | number) ?? index,
    [rowKey]
  );

  /* ---- derive dropdown option lists straight from the data ---- */
  const dropdownOptions = useMemo(() => {
    const map: Record<string, string[]> = {};
    columns.forEach((col) => {
      if (inferFilterKind(col) !== "dropdown") return;
      if (col.filter?.options) {
        map[col.key] = col.filter.options;
        return;
      }
      const unique = new Set<string>();
      data.forEach((row) => {
        const v = getValue(row, col.key);
        if (v !== null && v !== undefined && v !== "") unique.add(String(v));
      });
      map[col.key] = Array.from(unique).sort();
    });
    return map;
  }, [columns, data]);

  /* ---- global search ---- */
  const effectiveSearchKeys = useMemo<string[]>(() => {
    if (searchKeys?.length) return searchKeys;
    return columns.filter((c) => (c.filterable ?? isDefaultFilterable(c.type)) && c.type !== "custom").map((c) => c.key);
  }, [searchKeys, columns]);

  const searched = useMemo(() => {
    if (!searchText.trim()) return data;
    const needle = searchText.trim().toLowerCase();
    return data.filter((row) =>
      effectiveSearchKeys.some((key) => String(getValue(row, key) ?? "").toLowerCase().includes(needle))
    );
  }, [data, searchText, effectiveSearchKeys]);

  /* ---- advanced filters ---- */
  const filtered = useMemo(() => {
    const activeEntries = Object.entries(filters).filter(([, v]) => {
      if (v === undefined || v === null) return false;
      if (typeof v === "string") return v.trim() !== "";
      if ("min" in v || "max" in v) return !!(v.min || v.max);
      if ("from" in v || "to" in v) return !!(v.from || v.to);
      return false;
    });
    if (activeEntries.length === 0) return searched;

    return searched.filter((row) =>
      activeEntries.every(([key, value]) => {
        const col = columns.find((c) => c.key === key);
        const kind = col ? inferFilterKind(col) : "text";
        const raw = getValue(row, key);

        if (kind === "numberRange" && typeof value === "object" && value && "min" in value) {
          const num = Number(raw);
          const { min, max } = value as NumberRangeValue;
          if (min !== undefined && min !== "" && num < Number(min)) return false;
          if (max !== undefined && max !== "" && num > Number(max)) return false;
          return true;
        }

        if (kind === "dateRange" && typeof value === "object" && value && "from" in value) {
          const d = raw instanceof Date ? raw : new Date(String(raw));
          const { from, to } = value as DateRangeValue;
          if (from && d < new Date(from)) return false;
          if (to && d > new Date(`${to}T23:59:59`)) return false;
          return true;
        }

        if (kind === "dropdown" && typeof value === "string") {
          return String(raw ?? "") === value;
        }

        // text
        if (typeof value === "string") {
          return String(raw ?? "").toLowerCase().includes(value.toLowerCase());
        }
        return true;
      })
    );
  }, [searched, filters, columns]);

  /* ---- sorting ---- */
  const sorted = useMemo(() => {
    if (!sort.key || !sort.order) return filtered;
    const col = columns.find((c) => c.key === sort.key);
    const dir = sort.order === "asc" ? 1 : -1;

    return [...filtered].sort((a, b) => {
      const av = getValue(a, sort.key as string);
      const bv = getValue(b, sort.key as string);

      if (col?.type === "number" || col?.type === "rating") {
        return ((Number(av) || 0) - (Number(bv) || 0)) * dir;
      }
      if (col?.type === "date" || col?.type === "datetime") {
        const ad = av instanceof Date ? av : new Date(String(av));
        const bd = bv instanceof Date ? bv : new Date(String(bv));
        return (ad.getTime() - bd.getTime()) * dir;
      }
      return String(av ?? "").localeCompare(String(bv ?? ""), undefined, { numeric: true }) * dir;
    });
  }, [filtered, sort, columns]);

  /* ---- pagination calculation ---- */
  const effectiveTotalRows = isServerSide ? (paginationConfig?.totalRows || 0) : sorted.length;
  const totalPages = paginationConfig ? Math.max(1, Math.ceil(effectiveTotalRows / effectivePageSize)) : 1;
  const safePage = Math.min(effectivePage, totalPages);
  
  const pageRows = useMemo(() => {
    if (!paginationConfig) return sorted;
    if (isServerSide) return sorted; // If server-side, the API already sliced the data
    const start = (safePage - 1) * effectivePageSize;
    return sorted.slice(start, start + effectivePageSize);
  }, [sorted, safePage, effectivePageSize, paginationConfig, isServerSide]);

  /* ---- handlers ---- */
  const toggleSort = (col: Column<T>) => {
    const sortable = col.sortable ?? isDefaultSortable(col.type);
    if (!sortable) return;
    setSort((prev) => {
      if (prev.key !== col.key) return { key: col.key, order: "asc" };
      if (prev.order === "asc") return { key: col.key, order: "desc" };
      return { key: null, order: null };
    });
  };

  const updateFilter = (key: string, value: FilterValue) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    handlePageChange(1);
  };

  const clearFilters = () => {
    setFilters({});
    handlePageChange(1);
  };

  const activeFilterCount = Object.values(filters).filter((v) => {
    if (v === undefined || v === null) return false;
    if (typeof v === "string") return v.trim() !== "";
    if ("min" in v || "max" in v) return !!(v.min || v.max);
    if ("from" in v || "to" in v) return !!(v.from || v.to);
    return false;
  }).length;

  const exportCsv = () => {
    if (onExport) return onExport(sorted);
    const headers = columns.filter((c) => c.type !== "custom").map((c) => c.title);
    const keys = columns.filter((c) => c.type !== "custom").map((c) => c.key);
    const rows = sorted.map((row) =>
      keys
        .map((k) => {
          const v = getValue(row, k);
          const str = v === null || v === undefined ? "" : String(v);
          return `"${str.replace(/"/g, '""')}"`;
        })
        .join(",")
    );
    const csv = [headers.join(","), ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${(title || "table-export").toLowerCase().replace(/\s+/g, "-")}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  /* ---- default cell renderer per column type ---- */
  const renderCell = (col: Column<T>, row: T, rowIndex: number): React.ReactNode => {
    if (col.render) return col.render(row, rowIndex);
    const value = getValue(row, col.key);
    switch (col.type) {
      case "date":
        return formatDate(value, false);
      case "datetime":
        return formatDate(value, true);
      case "phone":
        return formatPhone(value, defaultCountryCode);
      case "status":
      case "badge":
        return <StatusBadge value={value} />;
      case "rating":
        return <RatingCell value={value} max={col.ratingMax ?? 5} />;
      case "link":
        return <LinkCell value={value} />;
      case "number":
        return value === null || value === undefined || value === "" ? "—" : Number(value).toLocaleString();
      default:
        return value === null || value === undefined || value === "" ? "—" : String(value);
    }
  };

  /* ==========================================================================
   * Render
   * ========================================================================*/

  return (
    <div
      className={cn("w-full", className)}
      style={{
        fontFamily: t.fontFamily,
        background: t.cardBackground,
        borderRadius: t.borderRadius,
        border: `1px solid ${t.borderColor}`,
      }}
    >
      {/* ---------------- Header / Toolbar ---------------- */}
      {(title || subtitle || showSearch || showFilter || showExport || toolbar?.customButtons) && (
        <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
          {(title || subtitle) && (
            <div className="min-w-0">
              {title && (
                <h3 className="truncate text-base font-semibold" style={{ color: t.bodyColor }}>
                  {title}
                </h3>
              )}
              {subtitle && <p className="mt-0.5 truncate text-sm text-slate-500">{subtitle}</p>}
            </div>
          )}

          <div className="flex flex-wrap items-center gap-2 sm:shrink-0">
            {showSearch && (
              <div className="relative">
                <IconSearch className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={searchText}
                  onChange={(e) => {
                    setSearchText(e.target.value);
                    handlePageChange(1);
                  }}
                  placeholder={toolbar?.searchPlaceholder ?? "Search..."}
                  className="h-10 w-full min-w-[10rem] rounded-xl border border-slate-200 bg-white pl-9 pr-3 text-sm text-slate-700 placeholder:text-slate-400 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100 sm:w-56"
                />
              </div>
            )}

            {showFilter && (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setFilterPanelOpen((o) => !o)}
                  className={cn(
                    "inline-flex h-10 items-center gap-2 rounded-xl border px-3.5 text-sm font-medium transition-colors",
                    activeFilterCount > 0
                      ? "border-indigo-200 bg-indigo-50 text-indigo-700"
                      : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                  )}
                >
                  <IconFilter className="h-4 w-4" />
                  Filters
                  {activeFilterCount > 0 && (
                    <span className="inline-flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-indigo-600 px-1 text-xs font-semibold text-white">
                      {activeFilterCount}
                    </span>
                  )}
                </button>

                {filterPanelOpen && (
                  <FilterPanel
                    columns={columns}
                    filters={filters}
                    dropdownOptions={dropdownOptions}
                    onChange={updateFilter}
                    onClear={clearFilters}
                    onClose={() => setFilterPanelOpen(false)}
                  />
                )}
              </div>
            )}

            {showExport && (
              <button
                type="button"
                onClick={exportCsv}
                className="inline-flex h-10 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 text-sm font-medium text-slate-600 hover:bg-slate-50"
              >
                <IconDownload className="h-4 w-4" />
                Export
              </button>
            )}

            {toolbar?.customButtons}
          </div>
        </div>
      )}

      {/* ---------------- Table ---------------- */}
      <div className="w-full overflow-x-auto">
        <table className="w-full min-w-[640px] border-collapse text-left" style={{ fontSize: t.bodyFontSize }}>
          <thead className={cn(stickyHeader && "sticky top-0 z-10")} style={{ background: t.headerBackground }}>
            <tr>
              {columns.map((col) => {
                const sortable = col.sortable ?? isDefaultSortable(col.type);
                const active = sort.key === col.key;
                return (
                  <th
                    key={col.key}
                    onClick={() => toggleSort(col)}
                    className={cn(
                      "select-none whitespace-nowrap px-4 py-3 font-semibold uppercase tracking-wide",
                      sortable && "cursor-pointer",
                      col.align === "right" && "text-right",
                      col.align === "center" && "text-center",
                      col.headerClassName
                    )}
                    style={{
                      color: t.headerColor,
                      fontSize: t.headerFontSize,
                      width: col.width,
                      minWidth: col.minWidth,
                    }}
                  >
                    <span className={cn("inline-flex items-center gap-1", col.align === "right" && "flex-row-reverse")}>
                      {col.title}
                      {sortable &&
                        (active && sort.order === "asc" ? (
                          <IconChevronUp className="h-3.5 w-3.5 text-indigo-600" />
                        ) : active && sort.order === "desc" ? (
                          <IconChevronDown className="h-3.5 w-3.5 text-indigo-600" />
                        ) : (
                          <IconChevronsUpDown className="h-3.5 w-3.5 text-slate-400" />
                        ))}
                    </span>
                  </th>
                );
              })}
            </tr>
          </thead>

          <tbody>
            {loading ? (
              Array.from({ length: Math.min(effectivePageSize, 6) }).map((_, i) => (
                <tr key={`skeleton-${i}`} className="border-t" style={{ borderColor: t.borderColor }}>
                  {columns.map((col) => (
                    <td key={col.key} className="px-4 py-4">
                      <div className="h-3.5 w-3/4 animate-pulse rounded bg-slate-200" />
                    </td>
                  ))}
                </tr>
              ))
            ) : pageRows.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-4 py-16">
                  <div className="flex flex-col items-center justify-center gap-2 text-slate-400">
                    <IconInbox className="h-10 w-10" />
                    <p className="text-sm font-medium text-slate-500">{emptyMessage}</p>
                  </div>
                </td>
              </tr>
            ) : (
              pageRows.map((row, i) => (
                <tr
                  key={getRowKey(row, i)}
                  onClick={() => onRowClick?.(row)}
                  className={cn("border-t transition-colors", onRowClick && "cursor-pointer")}
                  style={{ borderColor: t.borderColor, height: t.rowHeight }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = t.rowHoverBackground)}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                >
                  {columns.map((col) => (
                    <td
                      key={col.key}
                      className={cn(
                        "px-4 py-3 align-middle",
                        col.align === "right" && "text-right",
                        col.align === "center" && "text-center",
                        col.cellClassName
                      )}
                      style={{ color: t.bodyColor }}
                    >
                      {renderCell(col, row, i)}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* ---------------- Pagination ---------------- */}
      {paginationConfig && !loading && effectiveTotalRows > 0 && (
        <PaginationBar
          page={safePage}
          totalPages={totalPages}
          totalRows={effectiveTotalRows}
          pageSize={effectivePageSize}
          pageSizeOptions={paginationConfig.pageSizeOptions || [10, 20, 50, 100]}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
          accentColor={t.accentColor}
          borderColor={t.borderColor}
        />
      )}
    </div>
  );
}

/* ============================================================================
 * Filter panel subcomponent
 * ==========================================================================*/

function FilterPanel<T>({
  columns,
  filters,
  dropdownOptions,
  onChange,
  onClear,
  onClose,
}: {
  columns: Column<T>[];
  filters: FiltersState;
  dropdownOptions: Record<string, string[]>;
  onChange: (key: string, value: FilterValue) => void;
  onClear: () => void;
  onClose: () => void;
}) {
  const filterableColumns = columns.filter((c) => c.filterable ?? isDefaultFilterable(c.type));

  return (
    <div className="absolute right-0 z-20 mt-2 w-80 max-w-[90vw] rounded-2xl border border-slate-200 bg-white p-4 shadow-xl">
      <div className="mb-3 flex items-center justify-between">
        <p className="text-sm font-semibold text-slate-700">Advanced filters</p>
        <button onClick={onClose} className="rounded-md p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600">
          <IconX className="h-4 w-4" />
        </button>
      </div>

      <div className="max-h-80 space-y-4 overflow-y-auto pr-1">
        {filterableColumns.map((col) => {
          const kind = inferFilterKind(col);
          const value = filters[col.key];

          if (kind === "numberRange") {
            const v = (value as NumberRangeValue) || {};
            return (
              <div key={col.key}>
                <label className="mb-1 block text-xs font-medium text-slate-500">{col.title}</label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    placeholder="Min"
                    value={v.min ?? ""}
                    onChange={(e) => onChange(col.key, { ...v, min: e.target.value })}
                    className="h-9 w-full rounded-lg border border-slate-200 px-2.5 text-sm focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                  />
                  <span className="text-slate-400">–</span>
                  <input
                    type="number"
                    placeholder="Max"
                    value={v.max ?? ""}
                    onChange={(e) => onChange(col.key, { ...v, max: e.target.value })}
                    className="h-9 w-full rounded-lg border border-slate-200 px-2.5 text-sm focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                  />
                </div>
              </div>
            );
          }

          if (kind === "dateRange") {
            const v = (value as DateRangeValue) || {};
            return (
              <div key={col.key}>
                <label className="mb-1 block text-xs font-medium text-slate-500">{col.title}</label>
                <div className="flex items-center gap-2">
                  <input
                    type="date"
                    value={v.from ?? ""}
                    onChange={(e) => onChange(col.key, { ...v, from: e.target.value })}
                    className="h-9 w-full rounded-lg border border-slate-200 px-2.5 text-sm focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                  />
                  <span className="text-slate-400">–</span>
                  <input
                    type="date"
                    value={v.to ?? ""}
                    onChange={(e) => onChange(col.key, { ...v, to: e.target.value })}
                    className="h-9 w-full rounded-lg border border-slate-200 px-2.5 text-sm focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                  />
                </div>
              </div>
            );
          }

          if (kind === "dropdown") {
            const options = dropdownOptions[col.key] || [];
            return (
              <div key={col.key}>
                <label className="mb-1 block text-xs font-medium text-slate-500">{col.title}</label>
                <select
                  value={(value as string) ?? ""}
                  onChange={(e) => onChange(col.key, e.target.value || undefined)}
                  className="h-9 w-full rounded-lg border border-slate-200 bg-white px-2.5 text-sm focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                >
                  <option value="">All</option>
                  {options.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>
            );
          }

          // text
          return (
            <div key={col.key}>
              <label className="mb-1 block text-xs font-medium text-slate-500">{col.title}</label>
              <input
                type="text"
                placeholder={`Search ${col.title.toLowerCase()}`}
                value={(value as string) ?? ""}
                onChange={(e) => onChange(col.key, e.target.value || undefined)}
                className="h-9 w-full rounded-lg border border-slate-200 px-2.5 text-sm focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100"
              />
            </div>
          );
        })}
      </div>

      <button
        onClick={onClear}
        className="mt-4 w-full rounded-lg border border-slate-200 py-2 text-sm font-medium text-slate-500 hover:bg-slate-50"
      >
        Clear all filters
      </button>
    </div>
  );
}

/* ============================================================================
 * Pagination subcomponent
 * ==========================================================================*/

function PaginationBar({
  page,
  totalPages,
  totalRows,
  pageSize,
  pageSizeOptions,
  onPageChange,
  onPageSizeChange,
  accentColor,
  borderColor,
}: {
  page: number;
  totalPages: number;
  totalRows: number;
  pageSize: number;
  pageSizeOptions: number[];
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  accentColor: string;
  borderColor: string;
}) {
  const start = (page - 1) * pageSize + 1;
  const end = Math.min(page * pageSize, totalRows);

  const pageNumbers = useMemo(() => {
    const nums: (number | "...")[] = [];
    const windowSize = 1;
    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || Math.abs(i - page) <= windowSize) {
        nums.push(i);
      } else if (nums[nums.length - 1] !== "...") {
        nums.push("...");
      }
    }
    return nums;
  }, [page, totalPages]);

  return (
    <div
      className="flex flex-col gap-3 border-t px-5 py-4 sm:flex-row sm:items-center sm:justify-between"
      style={{ borderColor }}
    >
      <div className="flex items-center gap-2 text-sm text-slate-500">
        <span>
          Showing <span className="font-medium text-slate-700">{start}</span>–
          <span className="font-medium text-slate-700">{end}</span> of{" "}
          <span className="font-medium text-slate-700">{totalRows}</span>
        </span>
        <select
          value={pageSize}
          onChange={(e) => onPageSizeChange(Number(e.target.value))}
          className="ml-2 h-8 rounded-lg border border-slate-200 bg-white px-2 text-sm focus:outline-none"
        >
          {pageSizeOptions.map((size) => (
            <option key={size} value={size}>
              {size} / page
            </option>
          ))}
        </select>
      </div>

      <div className="flex items-center gap-1">
        <button
          onClick={() => onPageChange(Math.max(1, page - 1))}
          disabled={page === 1}
          className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-500 disabled:opacity-40"
        >
          <IconChevronLeft className="h-4 w-4" />
        </button>

        {pageNumbers.map((n, i) =>
          n === "..." ? (
            <span key={`ellipsis-${i}`} className="px-1 text-sm text-slate-400">
              …
            </span>
          ) : (
            <button
              key={n}
              onClick={() => onPageChange(n as number)}
              className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-sm font-medium"
              style={
                n === page
                  ? { background: accentColor, color: "#fff" }
                  : { color: "#64748b" }
              }
            >
              {n}
            </button>
          )
        )}

        <button
          onClick={() => onPageChange(Math.min(totalPages, page + 1))}
          disabled={page === totalPages}
          className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-500 disabled:opacity-40"
        >
          <IconChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

/**
 * Exported as a plain generic function (not React.memo) so TypeScript keeps
 * full generic inference at call sites — e.g. <ReusableTable<Feedback> ... />.
 */
export const ReusableTable = ReusableTableInner;
export default ReusableTable;