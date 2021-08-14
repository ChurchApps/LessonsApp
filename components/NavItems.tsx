import Link from "next/link";
import { useRouter } from "next/router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { IconProp } from "@fortawesome/fontawesome-svg-core";

type Props = {
  prefix?: string;
};

type Tab = {
  key: string;
  url: string;
  icon: IconProp;
  label: string;
};

const TABS: Tab[] = [
  {
    key: "Lessons",
    url: "/lessons",
    icon: faUser,
    label: "Lessons",
  },
];

export function NavItems({ prefix }: Props) {
  const router = useRouter();
  function getClass(sectionName: string) {
    return router.pathname === "/lessons" ? "nav-link active" : "nav-link";
  }

  function createTab({ key, url, icon, label }: Tab) {
    return (
      <li
        key={key}
        className="nav-item"
        data-toggle={prefix === "main" ? null : "collapse"}
        data-target={prefix === "main" ? null : "#userMenu"}
        id={(prefix || "") + key + "Tab"}
      >
        <Link href={url}>
          <a className={getClass(key)}>
            <FontAwesomeIcon icon={icon} /> {label}
          </a>
        </Link>
      </li>
    );
  }

  const tabs = TABS.map((t) => createTab(t));

  return <>{tabs}</>;
}
