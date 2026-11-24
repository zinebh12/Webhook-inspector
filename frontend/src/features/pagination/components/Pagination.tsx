import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronRight,
  faChevronLeft,
} from "@fortawesome/free-solid-svg-icons";
import { WebhookRequests } from "@/types/requests.types";
import { useEffect, useState } from "react";

const Pagination = ({ requests }: { requests: WebhookRequests }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [enableLeftBtn, setEnableLeftBtn] = useState<boolean>(false);
  const [enableRightBtn, setEnableRightBtn] = useState<boolean>(false);

  const totalPagesArray = Array.from(
    { length: requests?.totalPages },
    (_, i) => i + 1,
  );

  useEffect(() => {
    if (totalPagesArray.at(0) === currentPage) {
      setEnableLeftBtn(true);
    } else {
      setEnableLeftBtn(false);
    }

    if (totalPagesArray.at(-1) === currentPage) {
      setEnableRightBtn(true);
    } else {
      setEnableRightBtn(false);
    }
  }, [currentPage, enableLeftBtn, enableRightBtn, totalPagesArray]);

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-t border-white/10 py-4">
      <p className="text-xs text-muted-foreground">
        Showing <span className="text-foreground">{requests?.limit}</span> of{" "}
        <span className="text-foreground">{requests?.total}</span> requests
      </p>

      <div className="flex items-center gap-1">
        <button
          disabled={enableLeftBtn}
          onClick={() => {
            console.log("clicked");
            if (currentPage > 1) {
              setCurrentPage(currentPage - 1);
            } else return;
          }}
          className={`cursor-pointer flex h-8 w-8 items-center justify-center rounded-md border border-white/10 text-muted-foreground ${enableLeftBtn ? "opacity-40" : "opacity-100"} `}
        >
          <FontAwesomeIcon icon={faChevronLeft} />
        </button>
        {totalPagesArray.map((number) => (
          <button
            key={number}
            onClick={() => setCurrentPage(number)}
            className={`h-8 w-8 rounded-md text-sm text-muted-foreground ${number === currentPage && "bg-text-pinkest hover:bg-text-pinkest"} `}
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
          disabled={enableRightBtn}
          onClick={() => {
            setCurrentPage(currentPage + 1);
            if (totalPagesArray.at(-1) === currentPage) return;
          }}
          className={`cursor-pointer flex h-8 w-8 items-center justify-center rounded-md border border-white/10 text-muted-foreground ${enableRightBtn ? "opacity-40" : "opacity-100"} `}
        >
          <FontAwesomeIcon icon={faChevronRight} />
        </button>
      </div>
    </div>
  );
};

export default Pagination;
