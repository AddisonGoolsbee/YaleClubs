import React, { useEffect, useRef } from "react";
import { IClub } from "@/lib/models/Club";
import Board from "./Board";
import Image from "next/image";
import { getAdjustedNumMembers } from "@/lib/utils";
import { useMediaQuery } from "react-responsive";

type ClubModalProps = {
  club: IClub;
  onClose: () => void;
};

const ClubModal = ({ club, onClose }: ClubModalProps) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const isMobile = useMediaQuery({ maxWidth: 767 });

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div
        ref={modalRef}
        className="relative bg-white rounded-lg max-w-3xl w-full mx-4 md:mx-auto h-5/6 overflow-hidden flex flex-col"
      >
        <Image
          src={club.backgroundImage || "/assets/default-background.png"}
          alt="Club Background"
          className="w-full h-1/4 md:h-48 object-cover rounded-t-lg"
          width={768}
          height={192}
        />
        {isMobile && (
          <Image
            src={club.logo ?? "/assets/default-logo.png"}
            alt="Club Logo"
            width={100}
            height={100}
            className={`${club.logo ? "rounded-full" : ""} flex-shrink-0 border-2 border-white relative -top-[50px] mx-auto`}
          />
        )}
        <div className="flex flex-col overflow-y-auto overflow-x-hidden m-4 -mt-[50px] md:mt-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex flex-col md:w-3/5">
              <div
                className={`text-center md:text-left ${club.name.length > 100 ? "text-xl md:text-2xl" : "text-2xl md:text-3xl"} font-bold`}
              >
                {club.name}
              </div>
              {club.categories && club.categories.length > 0 && (
                <div className="flex gap-2 whitespace-nowrap w-full flex-wrap mt-4">
                  {club.categories.map((tag, index) => (
                    <span key={index} className="bg-[#eee] rounded px-2 py-1 text-sm">
                      {tag}
                    </span>
                  ))}
                </div>
              )}
              {club.affiliations && club.affiliations.length > 0 ? (
                <div className="w-fit bg-[#fdf] rounded px-2 py-1 text-sm mt-4">{club.affiliations[0]}</div>
              ) : (
                <div className="text-gray-700 text-md mt-4">Unknown affiliation</div>
              )}
              <div className="text-gray-700 mt-4 text-sm sm:text-base">{club.description || "No description"}</div>
            </div>
            <div className="flex flex-col md:w-2/5 items-center">
              {!isMobile && (
                <div className="flex flex-col items-center gap-4">
                  <Image
                    src={club.logo ?? "/assets/default-logo.png"}
                    alt="Club Logo"
                    width={100}
                    height={100}
                    className={`${club.logo ? "rounded-full" : ""} flex-shrink-0`}
                  />
                </div>
              )}
              <div className="flex flex-col w-full sm:w-3/4 md:w-full">
                {club.website && (
                  <div className="flex flex-row justify-between gap-2 text-sm mt-4 font-semibold">
                    <div className="text-gray-500">Website</div>
                    <a className="text-blue-500" href={"https://" + club.website}>
                      {club.website}
                    </a>
                  </div>
                )}
                <div className="flex flex-row justify-between gap-2 text-sm mt-4 font-semibold">
                  <div className="text-gray-500">Email</div>
                  {club.email ? (
                    <a className="text-blue-500" href={"mailto:" + club.email}>
                      {club.email}
                    </a>
                  ) : (
                    <div className="text-gray-500">Unknown email</div>
                  )}
                </div>
                <div className="flex flex-row justify-between gap-2 text-sm mt-4 font-semibold">
                  <div className="text-gray-500">Membership</div>
                  <div className="text-gray-500">
                    {club.numMembers ? getAdjustedNumMembers(club.numMembers) : "Unknown # of"} members
                  </div>
                </div>
                {club.instagram && (
                  <div className="flex flex-row justify-between gap-2 text-sm mt-4 font-semibold">
                    <div className="text-gray-500">Instagram</div>
                    <div className="text-gray-500">{club.instagram}</div>
                  </div>
                )}
                {club.applyForm && (
                  <div className="flex flex-row justify-between gap-2 text-sm mt-4 font-semibold">
                    <div className="text-gray-500">Application</div>
                    <a className="text-blue-500" href={"https://" + club.applyForm}>
                      Application Form
                    </a>
                  </div>
                )}
                {club.mailingListForm && (
                  <div className="flex flex-row justify-between gap-2 text-sm mt-4 font-semibold">
                    <div className="text-gray-500">Mailing List</div>
                    <a className="text-blue-500" href={club.mailingListForm}>
                      Mailing List
                    </a>
                  </div>
                )}
                {club.calendarLink && (
                  <div className="flex flex-row justify-between gap-2 text-sm mt-4 font-semibold">
                    <div className="text-gray-500">Calendar</div>
                    <a className="text-blue-500" href={club.calendarLink}>
                      Calendar Link
                    </a>
                  </div>
                )}
                {club.meeting && (
                  <div className="flex flex-row justify-between gap-2 text-sm mt-4 font-semibold">
                    <div className="text-gray-500">Meeting</div>
                    <div className="text-gray-500">{club.meeting}</div>
                  </div>
                )}
              </div>
            </div>
          </div>
          <Board leaders={club.leaders} />
        </div>
      </div>
    </div>
  );
};

export default ClubModal;
