import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { createPageUrl } from "@/lib/utils";

interface Props {
  path: string;
  perPage: number;
  page: number;
  count: number;
};

const BottomPagiation = ({ path, perPage, count, page }: Props) => {
  const totalPages = Math.ceil(count / perPage);
  const isFirstPage = page == 1;
  const isLastPage = page == totalPages;

  return (
    <Pagination className="justify-center">
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href={createPageUrl(path, page - 1)}
            className={isFirstPage ? "pointer-events-none opacity-50" : ""}
          />
        </PaginationItem>

        <PaginationItem>
          <div className="text-sm text-muted-foreground px-4">
            Page {page} of {totalPages}
          </div>
        </PaginationItem>

        <PaginationItem>
          <PaginationNext
            href={createPageUrl(path, page + 1)}
            className={isLastPage ? "pointer-events-none opacity-50" : ""}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  )
}

export default BottomPagiation;