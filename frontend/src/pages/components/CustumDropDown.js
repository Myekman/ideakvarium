import React from 'react';
import { Dropdown } from 'react-bootstrap';
import ClownfiskImage from '../../assets/images/clownfisk.png';
import SvärdfiskImage from '../../assets/images/svärdfisk2.png';
import BlåsfiskImage from '../../assets/images/blåsfisk.png';
import BläckfiskImage from '../../assets/images/bläckfisk.png';

function CustomDropdown({ fishData = {}, handleInputChange }) {
  return (
    <Dropdown onSelect={handleInputChange}>
      <Dropdown.Toggle variant="success" id="dropdown-basic">
        {fishData.fish_type || "Välj en fisktyp"}
      </Dropdown.Toggle>

      <Dropdown.Menu>
        <Dropdown.Item eventKey="svärdfisk">
          <img src={SvärdfiskImage} alt="Svärdskfish" style={{ width: '70px', height: 'auto' }}/>
        </Dropdown.Item>
        <Dropdown.Item eventKey="clownfisk">
          <img src={ClownfiskImage} alt="Clownfisk" style={{ width: '70px', height: 'auto' }}/>
        </Dropdown.Item>
        <Dropdown.Item eventKey="bläckfisk">
          <img src={BläckfiskImage} alt="Bläckfisk" style={{ width: '70px', height: 'auto' }} />
        </Dropdown.Item>
        <Dropdown.Item eventKey="blåsfisk">
          <img src={BlåsfiskImage} alt="Blåsfisk" style={{ width: '70px', height: 'auto' }}/>
        </Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );
}

export default CustomDropdown;