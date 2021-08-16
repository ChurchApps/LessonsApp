import React, { useState } from "react";
import { ApiHelper } from "../helpers";
import { PersonInterface } from "../interfaces"
import { Table, Button, FormControl, InputGroup } from "react-bootstrap";

interface Props {
    addFunction: (person: PersonInterface) => void,
    person?: PersonInterface,
    getPhotoUrl: (person: PersonInterface) => string,
    searchClicked?: () => void,
    filterList?: string[]
}

export const PersonAdd: React.FC<Props> = ({ addFunction, getPhotoUrl, searchClicked, filterList = [] }) => {
  const [searchResults, setSearchResults] = useState<PersonInterface[]>([]);
  const [searchText, setSearchText] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => { e.preventDefault(); setSearchText(e.currentTarget.value); }
  const handleKeyDown = (e: React.KeyboardEvent<any>) => { if (e.key === "Enter") { e.preventDefault(); handleSearch(null); } }

  const handleSearch = (e: React.MouseEvent) => {
    if (e !== null) e.preventDefault();
    let term = escape(searchText.trim());
    ApiHelper.get("/people/search?term=" + term, "MembershipApi")
      .then((data: PersonInterface[]) => {
        const filteredResult = data.filter(s => !filterList.includes(s.id))
        setSearchResults(filteredResult);
        if (searchClicked) {
          searchClicked();
        }
      });
  }
  const handleAdd = (e: React.MouseEvent) => {
    let anchor = e.currentTarget as HTMLAnchorElement;
    let idx = anchor.getAttribute("data-index");
    let sr: PersonInterface[] = [...searchResults];
    let person: PersonInterface = sr.splice(parseInt(idx), 1)[0];
    setSearchResults(sr);
    addFunction(person);
  }

  let rows = [];
  for (let i = 0; i < searchResults.length; i++) {
    let sr = searchResults[i];
    rows.push(
      <tr key={sr.id}>
        <td><img src={getPhotoUrl(sr)} alt="avatar" /></td>
        <td>{sr.name.display}</td>
        <td><button className="text-success no-default-style" aria-label="addPerson" data-index={i} onClick={handleAdd}><i className="fas fa-user"></i> Add</button></td>
      </tr>
    );
  }

  return (
    <>
      <InputGroup>
        <FormControl id="personAddText" aria-label="searchbox" value={searchText} onChange={handleChange} onKeyDown={handleKeyDown} />
        <div className="input-group-append"><Button id="personAddButton" variant="primary" onClick={handleSearch}><i className="fas fa-search"></i> Search</Button></div>
      </InputGroup>
      <Table size="sm" id="householdMemberAddTable"><tbody>{rows}</tbody></Table>
    </>
  );
}
