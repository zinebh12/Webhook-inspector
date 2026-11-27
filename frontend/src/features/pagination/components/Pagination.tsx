import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronRight,
  faChevronLeft,
} from "@fortawesome/free-solid-svg-icons";
import { WebhookRequests } from "@/types/requests.types";

const Pagination = ({
  requests,
  currentPage,
  setCurrentPage,
  onPageChange,
}: {
  requests?: WebhookRequests;
  currentPage: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  onPageChange: (page: number) => void;
}) => {
  const totalPagesArray = Array.from(
    { length: requests?.totalPages ?? 0 },
    (_, i) => i + 1,
  );

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-t border-white/10 py-4">
      <p className="text-xs text-muted-foreground">
        Showing <span className="text-foreground">{requests?.data.length}</span>{" "}
        of <span className="text-foreground">{requests?.total}</span> requests
      </p>

      <div className="flex items-center gap-1">
        <button
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
          className="cursor-pointer flex h-8 w-8 items-center justify-center rounded-md border border-white/10 text-muted-foreground disabled:opacity-40"
        >
          <FontAwesomeIcon icon={faChevronLeft} />
        </button>
        {totalPagesArray.map((number) => (
          <button
            key={number}
            onClick={() => setCurrentPage(number)}
            className={`cursor-pointer focus:outline-none h-8 w-8 rounded-md text-sm text-muted-foreground ${number === currentPage && "bg-text-pinkest hover:bg-text-pinkest"} `}
          >
            {number}
          </button>
        ))}

        {requests?.totalPages >= 8 && (
          <>
            <span className="px-1 text-sm text-muted-foreground">...</span>

            <button className="h-8 w-8 rounded-md text-sm text-muted-foreground hover:bg-white/5">
              {totalPagesArray[-1]}
            </button>
          </>
        )}
        <button
          disabled={currentPage === requests?.totalPages}
          onClick={() => onPageChange(currentPage + 1)}
          className="cursor-pointer flex h-8 w-8 items-center justify-center rounded-md border border-white/10 text-muted-foreground disabled:opacity-40"
        >
          <FontAwesomeIcon icon={faChevronRight} />
        </button>
      </div>
    </div>
  );
};

export default Pagination;
