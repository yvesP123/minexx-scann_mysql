import React, { useState } from 'react';
import { Accordion, ListGroup, Card, Alert } from 'react-bootstrap';
import PropTypes from 'prop-types';

const AssessmentSection = ({ assessment }) => {
  const [activeHeader, setActiveHeader] = useState(null);

  // Function to group headers and subheaders
  const groupHeaders = (headers, data) => {
    if (!Array.isArray(headers) || !Array.isArray(data)) {
      console.error('Invalid assessment data structure');
      return [];
    }

    const result = [];
    let currentGroup = null;

    headers.forEach((header, index) => {
      if (header === header.toUpperCase()) {
        if (currentGroup) {
          result.push(currentGroup);
        }
        currentGroup = { header, subheaders: [], data: [] };
      } else if (currentGroup) {
        currentGroup.subheaders.push(header);
        currentGroup.data.push(data[index]);
      }
    });

    if (currentGroup) {
      result.push(currentGroup);
    }

    return result;
  };

  if (!assessment || !assessment.header || !assessment.general) {
    return <Alert variant="danger">Invalid assessment data provided.</Alert>;
  }

  const groupedHeaders = groupHeaders(assessment.header, assessment.general);

  if (groupedHeaders.length === 0) {
    return <Alert variant="warning">No assessment data to display.</Alert>;
  }

  return (
    <div className="row">
      <div className="col-xl-3">
        <ListGroup className="mb-4" id="list-tab">
          {groupedHeaders.map((group, index) => (
            <ListGroup.Item
              key={index}
              onClick={() => setActiveHeader(index)}
              action
              active={activeHeader === index}
            >
              {group.header}
            </ListGroup.Item>
          ))}
        </ListGroup>
      </div>

      <div className='col-xl-9'>
        {activeHeader !== null && groupedHeaders[activeHeader] && (
          <Card>
            <Card.Header>{groupedHeaders[activeHeader].header}</Card.Header>
            <Card.Body>
              <Accordion>
                {groupedHeaders[activeHeader].subheaders.map((subheader, index) => (
                  <Accordion.Item key={index} eventKey={index.toString()}>
                    <Accordion.Header>{subheader}</Accordion.Header>
                    <Accordion.Body>
                      {groupedHeaders[activeHeader].data[index]}
                    </Accordion.Body>
                  </Accordion.Item>
                ))}
              </Accordion>
            </Card.Body>
          </Card>
        )}
      </div>
    </div>
  );
};

AssessmentSection.propTypes = {
  assessment: PropTypes.shape({
    header: PropTypes.array.isRequired,
    general: PropTypes.array.isRequired
  }).isRequired
};

export default AssessmentSection;