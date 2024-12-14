import React, { useState, useEffect } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import { Accordion, ListGroup, Nav, Tab } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { assessmentHeaders } from '../components/Config';
import { Loader } from 'lucide-react';
import { useMediaQuery } from 'react-responsive';

const ExportPage = () => {
  const { id } = useParams();
  const{company_id}=useParams();
  const query = new URLSearchParams(useLocation().search);
  console.log(query.toString());
  const platform = query.get('x-platform') || '3ts';
  console.log('Platform:', platform); 
  //usestate for Mine Tab
  const [companymine,setCompanyMine]=useState(null);
  const [companydocmine,setCompanyDocMine]=useState([]);
  const [companybeneficialmine,setCompanyBeneficialMine]=useState([]);
  const [compamnyshareholdermine,setCompanyShareholderMine]=useState([]);
  const [activeHeader, setActiveHeader] = useState(null);
  const [assessment, setAssessment] = useState(null);
  const [showAssessmentDetails, setShowAssessmentDetails] = useState(false);
  const[minesite,setMineSite]=useState(null)


  
  const [export_, setExport_] = useState(null);
  const [company, setCompany] = useState(null);
  const [companyDocs, setCompanyDocs] = useState([]);
  const [shareholder,setShareholder]=useState([]);
  const [beneficial,setBeneficial]=useState([]);
  const [document, setDocument] = useState(0);
  const [uploads, setUploads] = useState([]);
  const [activeDocumentKey, setActiveDocumentKey] = useState('doc-0');
  const [slice, setslice] = useState({ start: 0, end: 0 });
  const [index, setindex] = useState(0);
  const isMobile = useMediaQuery({ maxWidth: 767 });

  const documents = platform === "gold" ? [
    "Exporter Invoice",
    "Packing List",
    "Non-narcotics Note",
    "Essay Report",
    "Proof of Payment of Essay and Witholding Tax",
    "Copy of Customs Declaration",
    "Export Approval"
  ] : [
    `Provisional Invoice`,
    `Freight Forwarder's Cargo Receipt`,
    `Exporter Sheet`,
    `Alex Stewart Certificate of Assay`,
    `Alex Stewart Packing report including weight`,
    `Certificate of Origin-certified by government authorities`,
    `ICGLR Certificate`,
    `Inland Transportation from Mine to the port`,
    `Original Warehouse Certificate`,
    `Certificate of Insurance`,
    `Bill of Lading`,
    `C2 Form`,
    `Mine Sheets`,
    `Processing Sheets`,
    `RRA Customs Declaration`,
    `Tag List`,
    `Other Scanned Exporter Documents`,
    `Other Exporter Documents`,
    `Other Transporter Document`,
  ];
  const headers = ['General Information', 'Legitimacy', 'HUMAN AND WORKERS RIGTHS', 'Societal Welfare / Security', 'Company Governance', 'Chain of Custody/Traceability/Tracking', 'Environment', 'Community Impact']
  const indexes = ['general', 'legitimacy', 'rights', 'welfare', 'governance', 'traceability', 'environment', 'community']
  const getFilteredHeaders = (headers) => {
    return headers.filter(header => {
      return header !== header.toUpperCase() || header.length <= 2;
    });
  };

  const getValueIndex = (headerIndex, allHeaders) => {
    let valueIndex = 0;
    for (let i = 0; i <= headerIndex; i++) {
      if (allHeaders[i] !== allHeaders[i].toUpperCase() || allHeaders[i].length <= 2) {
        valueIndex++;
      }
    }
    return valueIndex - 1;
  };

  // Calculate slices
  const slices = assessmentHeaders.reduce((acc, header, index) => {
    if (header === header.toUpperCase() && header.length > 2) {
      if (acc.length > 0) {
        acc[acc.length - 1].end = index;
      }
      acc.push({ start: index + 1, end: assessmentHeaders.length });
    }
    return acc;
  }, []);
  const [debugInfo, setDebugInfo] = useState({});
  // const assessment = JSON.parse(localStorage.getItem(`assessment`))

  useEffect(() => {
    const getExport = async () => {
      try {
        const response = await fetch(`https://minexxapi-db-426415920655.us-central1.run.app/exportnoauth/${id}`,
          {
            method:'GET',
            headers:
            {
              'x-platform':platform
            }
          });
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        console.log(data);
        setExport_(data.export);
        setUploads(platform === "gold" ? [
          data.export.provisionalInvoice,
          data.export.packingReport,
          data.export.note,
          data.export.scannedExportDocuments,
          data.export.otherDocument,
          data.export.customsDeclaration,
          data.export.exporterApplicationDocument,
        ] : [
          data.export.provisionalInvoice,
          data.export.cargoReceipt,
          data.export.itsciForms,
          data.export.asiDocument,
          data.export.packingReport,
          data.export.rraExportDocument,
          data.export.rmbExportDocument,
          data.export.otherDocument,
          data.export.warehouseCert,
          data.export.insuranceCert,
          data.export.billOfLanding,
          data.export.c2,
          data.export.mineSheets,
          data.export.processingSheets,
          data.export.customsDeclaration,
          data.export.tagList,
          data.export.scannedExportDocuments,
          data.export.exporterApplicationDocument,
          data.export.transporterDocument
        ]);
        const companyResponse = await fetch(`https://minexxapi-db-426415920655.us-central1.run.app/companiesnoAuth/${company_id}`,
          {
            method:'GET',
            headers:
            {
              'x-platform':platform
            }
          });
        if (!companyResponse.ok) {
          throw new Error('Network response was not ok for company details');
        }
        const companyData = await companyResponse.json();
        setCompany(companyData);
        console.log("compony Data",companyData);

        //for documentation
        const companyDocResponse = await fetch(`https://minexxapi-db-426415920655.us-central1.run.app/documentsnoAuth/${company_id}`,
          {
            method:'GET',
            headers:
            {
              'x-platform':platform
            }
          });
        if (!companyResponse.ok) {
          throw new Error('Network response was not ok for company details');
        }
        const companyDocData = await companyDocResponse.json();
        setCompanyDocs(companyDocData.documents);
        console.log("compony Data Document",companyDocData);
        //for shareholder
        const shareholderResponse = await fetch(`https://minexxapi-db-426415920655.us-central1.run.app/shareholdersnoAuth/${company_id}`,
          {
            method:'GET',
            headers:
            {
              'x-platform':platform
            }
          });
        if (!companyResponse.ok) {
          throw new Error('Network response was not ok for company details');
        }
        const shareholderData = await shareholderResponse.json();
        setShareholder(shareholderData.shareholders);
        console.log("Shareholder Data",shareholderData.shareholders);
        //for beneficial
        const beneficialResponse = await fetch(`https://minexxapi-db-426415920655.us-central1.run.app/ownersnoAuth/${company_id}`,
          {
            method:'GET',
            headers:
            {
              'x-platform':platform
            }
          });
        if (!companyResponse.ok) {
          throw new Error('Network response was not ok for company details');
        }
        const beneficialData = await beneficialResponse.json();
        setBeneficial(beneficialData.beneficial_owners);
        console.log("Shareholder Data",beneficialData.beneficial_owners);
        //for Mine tab CompanyMine
        const CompanyMineResponse = await fetch(`https://minexxapi-db-426415920655.us-central1.run.app/companiesMine`,
          {
            method:'GET',
          });
        if (!CompanyMineResponse.ok) {
          throw new Error('Network response was not ok for company details');
        }
        const CompanyMineData = await CompanyMineResponse.json();
        setCompanyMine(CompanyMineData.company);
        console.log("Mine Data",CompanyMineData.company);
        //For Mine tab owner
        const CompanyMineownerResponse = await fetch(`https://minexxapi-db-426415920655.us-central1.run.app/ownersMine`,
          {
            method:'GET',
          });
        if (!CompanyMineownerResponse.ok) {
          throw new Error('Network response was not ok for company details');
        }
        const CompanyMineownerData = await CompanyMineownerResponse.json();
        setBeneficial(CompanyMineownerData.beneficial_owners);
        console.log("Mine Beneficial Owener Data",CompanyMineData.beneficial_owners);
        //For Mines table document
        const CompanyMineDocResponse = await fetch(`https://minexxapi-db-426415920655.us-central1.run.app/documentsMine`,
          {
            method:'GET',
          });
        if (!CompanyMineDocResponse.ok) {
          throw new Error('Network response was not ok for company details');
        }
        const CompanyMineDocData = await CompanyMineDocResponse.json();
        setCompanyDocMine(CompanyMineDocData.documents);
        console.log("Mine Document Data",CompanyMineData.documents);
        //For Mine Shareholer
        const CompanyMineShareResponse = await fetch(`https://minexxapi-db-426415920655.us-central1.run.app/shareholdersMine`,
          {
            method:'GET',
          });
        if (!CompanyMineShareResponse.ok) {
          throw new Error('Network response was not ok for company details');
        }
        const CompanyMineShareData = await CompanyMineShareResponse.json();
        setCompanyShareholderMine(CompanyMineShareData.shareholders);
        console.log("Mine Shareholder Data",CompanyMineData.shareholders);
        
       
     
      } catch (err) {
        toast.error("Error fetching export details");
        console.error("Error fetching export details:", err);
      }
    };
    const fetMinesite=async()=>
    {
      try {
        
        const response=await fetch(`https://minexxapi-db-426415920655.us-central1.run.app/minesnoauth`,
          {
            method:'GET'
          });
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          const data = await response.json();
          const minesite_id=data.mine.id;
          console.log("company Mine site",data.mine);
          await fetchAssessmentData(minesite_id);
          setMineSite(data.mine.name)
      } catch (error) 
      {
        console.error("Error fecting the Minesite",error)
        
      }

    }
    const fetchAssessmentData = async (minesite_id) => {
      try {
        const response = await fetch(`https://minexxapi-db-426415920655.us-central1.run.app/assessments/mines/${minesite_id}`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setAssessment(data.assessments[0]);
        setActiveHeader(Object.keys(data.assessments[0])[0].toUpperCase());
      } catch (error) {
        console.error('Error fetching assessment data:', error);
      }
    };
   
    // fetchAssessmentData();
    getExport();
    fetMinesite();
  }, [id, platform,company_id]);
 
  const renderSubHeaders = (header) => {
    if (!assessment || !assessment[header]) return null;

    const subHeaderItems = assessment[header].map((value, i) => {
      const headerIndex = assessmentHeaders.findIndex(
        h => h.toLowerCase().includes(headers[indexes.indexOf(header)].toLowerCase())
      );
      
      let subHeaders = [];
      for (let j = headerIndex + 1; j < assessmentHeaders.length; j++) {
        if (assessmentHeaders[j] === assessmentHeaders[j].toUpperCase() && assessmentHeaders[j].length > 2) break;
        subHeaders.push(assessmentHeaders[j]);
      }
      
      // Skip rendering if the subheader is "Mine/Concession Name" or "ID Number"
      if (subHeaders[i] && 
          subHeaders[i].trim() !== '' && 
          value && 
          !subHeaders[i].includes('Mine/Concession Name') && 
          !subHeaders[i].includes('ID Number')) {
        return (
          <Accordion.Item className="accordion-item" key={i} eventKey={i.toString()}>
            <Accordion.Header className="accordion-header rounded-lg">
              {subHeaders[i]}
            </Accordion.Header>
            <Accordion.Collapse eventKey={i.toString()}>
              <div className="accordion-body">
                {subHeaders[i].includes('Proof Details') ||
                subHeaders[i].includes('Image') ||
                subHeaders[i].includes('Photo') ||
                subHeaders[i].includes('Pictures') ? (
                  <img 
                    alt='' 
                    src={`https://lh3.googleusercontent.com/d/${value}=w2160?authuser=0`}
                    style={{ maxWidth: '100%', height: 'auto' }}
                  />
                ) : (
                  <p className='text-light'>{value}</p>
                )}
              </div>
            </Accordion.Collapse>
          </Accordion.Item>
        );
      }
      return null;
    }).filter(Boolean);

    // If no subheaders are displayed, show "No information recorded"
    if (subHeaderItems.length === 0) {
      return (
        
            <div className="accordion-body">
              <p className='text-light'>No information recorded</p>
            </div>
       
      );
    }

    return subHeaderItems;
  };

  const renderAssessmentContent = () => (
    <div className={`row ${isMobile ? 'flex-column' : ''}`}>
      <div className={isMobile ? 'col-12' : 'col-xl-3'}>
        <ListGroup className="mb-4" id="list-tab">
          {headers.map((item, i) => (
            <ListGroup.Item
              key={i}
              onClick={() => setActiveHeader(indexes[i])}
              action
              href={`#${i}`}
            >
              {item}
              {isMobile && activeHeader === indexes[i] && (
                <Accordion className="mt-3">
                  {renderSubHeaders(indexes[i])}
                </Accordion>
              )}
            </ListGroup.Item>
          ))}
        </ListGroup>
      </div>
      {!isMobile && (
        <div className='col-xl-9'>
          <Accordion className="accordion accordion-primary" defaultActiveKey="0">
            {renderSubHeaders(activeHeader)}
          </Accordion>
        </div>
      )}
    </div>
  );

  if (!export_|| !company || !companyDocs || !shareholder || !beneficial || !companymine || !compamnyshareholdermine || !companydocmine || !companybeneficialmine) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
        <Loader size={48} className="animate-spin" />
      </div>
    );
  }
  // const renderAssessmentContent = () => (
  //   <div className="row">
  //     <div className="col-xl-3">
  //       <ListGroup className="mb-4" id="list-tab">
  //         {headers.map((item, i) => (
  //           <ListGroup.Item
  //             key={i}
  //             onClick={() => setActiveHeader(indexes[i])}
  //             action
  //             href={`#${i}`}
  //           >
  //             {item}
  //           </ListGroup.Item>
  //         ))}
  //       </ListGroup>
  //     </div>
  //     <div className='col-xl-9'>
  //       <Accordion className="accordion accordion-primary" defaultActiveKey="0">
  //         {assessment && assessment[activeHeader] ? (
  //           assessment[activeHeader].map((value, i) => {
  //             // Find the corresponding header in assessmentHeaders
  //             const headerIndex = assessmentHeaders.findIndex(
  //               h => h.toLowerCase().includes(headers[indexes.indexOf(activeHeader)].toLowerCase())
  //             );
              
  //             // Get sub-headers
  //             let subHeaders = [];
  //             for (let j = headerIndex + 1; j < assessmentHeaders.length; j++) {
  //               if (assessmentHeaders[j] === assessmentHeaders[j].toUpperCase() && assessmentHeaders[j].length > 2) break;
  //               subHeaders.push(assessmentHeaders[j]);
  //             }
              
  //             // Check if the subheader exists and is not empty
  //             if (subHeaders[i] && subHeaders[i].trim() !== '') {
  //               return (
  //                 <Accordion.Item className="accordion-item" key={i} eventKey={i.toString()}>
  //                   <Accordion.Header className="accordion-header rounded-lg">
  //                     {subHeaders[i]}
  //                   </Accordion.Header>
  //                   <Accordion.Collapse eventKey={i.toString()}>
  //                     <div className="accordion-body">
  //                       {subHeaders[i].includes('Proof Details') ||
  //                       subHeaders[i].includes('Image') ||
  //                       subHeaders[i].includes('Photo') ||
  //                       subHeaders[i].includes('Pictures') ? (
  //                         <img 
  //                           alt='' 
  //                           src={`https://lh3.googleusercontent.com/d/${value}=w2160?authuser=0`}
  //                           style={{ maxWidth: '100%', height: 'auto' }}
  //                         />
  //                       ) : (
  //                         <p className='text-light'>{value || 'No data available'}</p>
  //                       )}
  //                     </div>
  //                   </Accordion.Collapse>
  //                 </Accordion.Item>
  //               );
  //             }
  //             return null;
  //           })
  //         ) : (
  //           <p className='font-w200 text-center'>No information recorded or assessment data not loaded</p>
  //         )}
  //       </Accordion>
  //     </div>
  //   </div>
  // );

  return (
    <div>
      <div className="row">
        <Tab.Container defaultActiveKey="basic">
          <div className='col-xl-12'>
            <div className="card">
              <div className="card-body px-4 py-3 py-md-2">
                <div className="row align-items-center">
                  <div className="col-sm-12 col-md-7">
                    <Nav as="ul" className="nav nav-pills review-tab" role="tablist">
                      <Nav.Item as="li" className="nav-item">
                        <Nav.Link className="nav-link  px-2 px-lg-3" to="#basic" role="tab" eventKey="basic">
                          Shipment Details
                        </Nav.Link>
                      </Nav.Item>
                      <Nav.Item as="li" className="nav-item">
                        <Nav.Link className="nav-link px-2 px-lg-3" to="#documents" role="tab" eventKey="documents">
                          Documents
                        </Nav.Link>
                      </Nav.Item>
                      <Nav.Item as="li" className="nav-item">
                        <Nav.Link className="nav-link px-2 px-lg-3" to="#exporter" role="tab" eventKey="exporter">
                        Exporter
                        </Nav.Link>
                      </Nav.Item>
                      <Nav.Item as="li" className="nav-item">
                        <Nav.Link className="nav-link px-2 px-lg-3" to="#Mine" role="tab" eventKey="Mine">
                        Mine
                        </Nav.Link>
                      </Nav.Item>
                    </Nav>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-xl-12 col-xxl-12">
            <Tab.Content>
              <Tab.Pane eventKey="basic" id='basic'>
                <div className='card'>
                  <div className='card-body'>
                    <Accordion className="accordion accordion-primary" defaultActiveKey="exportation">
                      <Accordion.Item className="accordion-item" key="exportation" eventKey="exportation">
                        <Accordion.Header className="accordion-header rounded-lg">
                          Exportation Details
                        </Accordion.Header>
                        <Accordion.Collapse eventKey="exportation">
                          <div className="accordion-body">
                            <div className='row'>
                              <div className='col-lg-6'>
                                <img src={export_?.picture ? `https://lh3.googleusercontent.com/d/${export_?.picture}=w2160?authuser=0` : 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQx4xrkRCeiKCPwkflbkXd11W_2fzx34RemdWXmv8TXYWLT2SGtLfkqFCyBb_CBoNcNVBc&usqp=CAU'} alt='' width='100%' height={600} style={{ objectFit: 'cover' }} className='rounded'/>
                              </div>
                              <div className='col-lg-6'>
                                { export_?.exportationID &&
                                  <>
                                    <h4 className="text-primary mb-2 mt-4">Exportation ID</h4>
                                    <Link className="text-light" style={{ textDecoration: 'none' }}>{export_?.exportationID}</Link>
                                  </>
                                }
                                { export_?.date &&
                                  <>
                                    <h4 className="text-primary mb-2 mt-4">Exportation Date</h4>
                                    <Link className="text-light" style={{ textDecoration: 'none' }}>{export_?.date}</Link>
                                  </>
                                }
                                { export_?.mineral &&
                                  <>
                                    <h4 className="text-primary mb-2 mt-4">Mineral Type</h4>
                                    <Link className="text-light" style={{ textDecoration: 'none' }}>{export_?.mineral}</Link>
                                  </>
                                }
                                { export_?.grade &&
                                  <>
                                    <h4 className="text-primary mb-2 mt-4">Grade</h4>
                                    <Link className="text-light" style={{ textDecoration: 'none' }}>{export_?.grade}</Link>
                                  </>
                                }
                                { export_?.netWeight &&
                                  <>
                                    <h4 className="text-primary mb-2 mt-4">Net Weight</h4>
                                    <Link className="text-light" style={{ textDecoration: 'none' }}>
                                      {platform === 'gold' ? (export_?.netWeight/1000).toFixed(2) : export_?.netWeight} kg
                                    </Link>
                                  </>
                                }
                                { export_?.grossWeight &&
                                  <>
                                    <h4 className="text-primary mb-2 mt-4">Gross Weight</h4>
                                    <Link className="text-light" style={{ textDecoration: 'none' }}>{export_?.grossWeight} kg</Link>
                                  </>
                                }
                                { export_?.tags &&
                                  <>
                                    <h4 className="text-primary mb-2 mt-4">Number of Tags</h4>
                                    <Link className="text-light" style={{ textDecoration: 'none' }}>{export_?.tags}</Link>
                                  </>
                                }
                              </div>
                            </div>
                          </div>
                        </Accordion.Collapse>
                      </Accordion.Item>
                      <br/>
                      { export_?.link && 
                        <Accordion.Item className="accordion-item" key="transport" eventKey="shipment">
                          <Accordion.Header className="accordion-header rounded-lg">
                            Shipment Tracking
                          </Accordion.Header>
                          <Accordion.Collapse eventKey={`shipment`}>
                            <div className="accordion-body">
                              <a target="_blank" href={`${export_?.link}`} className='text-primary' rel="noreferrer">Click here to Track the Shipment</a>
                            </div>
                          </Accordion.Collapse>
                        </Accordion.Item>
                      }
                      <Accordion.Item className="accordion-item" key="transport" eventKey="transport">
                        <Accordion.Header className="accordion-header rounded-lg">
                          Transport Details
                        </Accordion.Header>
                        <Accordion.Collapse eventKey={`transport`}>
                          <div className="accordion-body">
                            { export_?.destination &&
                              <>
                                <h4 className="text-primary mb-2 mt-4">Destination</h4>
                                <Link className="text-light" style={{ textDecoration: 'none' }}>{export_?.destination}</Link>
                              </>
                            }
                            { export_?.itinerary &&
                              <>
                                <h4 className="text-primary mb-2 mt-4">Itinerary</h4>
                                <Link className="text-light" style={{ textDecoration: 'none' }}>{export_?.itinerary}</Link>
                              </>
                            }
                            { export_?.shipmentNumber &&
                              <>
                                <h4 className="text-primary mb-2 mt-4">Shipment Number</h4>
                                <Link className="text-light" style={{ textDecoration: 'none' }}>{export_?.shipmentNumber}</Link>
                              </>
                            }
                            { export_?.exportCert &&
                              <>
                                <h4 className="text-primary mb-2 mt-4">Export Certificate Number</h4>
                                <Link className="text-light" style={{ textDecoration: 'none' }}>{export_?.exportCert}</Link>
                              </>
                            }
                            { export_?.rraCert &&
                              <>
                                <h4 className="text-primary mb-2 mt-4">RRA certificate Number</h4>
                                <Link className="text-light" style={{ textDecoration: 'none' }}>{export_?.rraCert}</Link>
                              </>
                            }
                            { export_?.transporter &&
                              <>
                                <h4 className="text-primary mb-2 mt-4">Transporter</h4>
                                <Link className="text-light" style={{ textDecoration: 'none' }}>{export_?.transporter}</Link>
                              </>
                            }
                            { export_?.driverID &&
                              <>
                                <h4 className="text-primary mb-2 mt-4">Driver ID Number</h4>
                                <Link className="text-light" style={{ textDecoration: 'none' }}>{export_?.driverID}</Link>
                              </>
                            }
                            { export_?.truckFrontPlate &&
                              <>
                                <h4 className="text-primary mb-2 mt-4">Truck Front Plate</h4>
                                <Link className="text-light" style={{ textDecoration: 'none' }}>{export_?.truckFrontPlate}</Link>
                              </>
                            }
                            { export_?.truckBackPlate &&
                              <>
                                <h4 className="text-primary mb-2 mt-4">Truck Back Plate</h4>
                                <Link className="text-light" style={{ textDecoration: 'none' }}>{export_?.truckBackPlate}</Link>
                              </>
                            }
                          </div>
                        </Accordion.Collapse>
                      </Accordion.Item>
                      <br/>
                      <Accordion.Item className="accordion-item" key="representatives" eventKey="representatives">
                        <Accordion.Header className="accordion-header rounded-lg">
                          Representatives Details
                        </Accordion.Header>
                        <Accordion.Collapse eventKey={`representatives`}>
                          <div className="accordion-body">
                            { export_?.rmbRep &&
                              <>
                                <h4 className="text-primary mb-2 mt-4">RMB Representative</h4>
                                <Link className="text-light" style={{ textDecoration: 'none' }}>{export_?.rmbRep}</Link>
                              </>
                            }
                            { export_?.exportRep &&
                              <>
                                <h4 className="text-primary mb-2 mt-4">Exporter Representative</h4>
                                <Link className="text-light" style={{ textDecoration: 'none' }}>{export_?.exportRep}</Link>
                              </>
                            }
                            { export_?.traceabilityAgent &&
                              <>
                                <h4 className="text-primary mb-2 mt-4">Traceability Agent</h4>
                                <Link className="text-light" style={{ textDecoration: 'none' }}>{export_?.traceabilityAgent}</Link>
                              </>
                            }
                          </div>
                        </Accordion.Collapse>
                      </Accordion.Item>
                    </Accordion>
                  </div>
                </div>
              </Tab.Pane>
              <Tab.Pane eventKey="documents" id='documents'>
                <div className="card">
                  <div className="card-body">
                <Accordion 
                    className="accordion accordion-primary"
                    activeKey={activeDocumentKey}
                    onSelect={(eventKey) => setActiveDocumentKey(eventKey)}>
                      {documents.map((item, i) => (
                        <Accordion.Item className="accordion-item" key={i} eventKey={`doc-${i}`}>
                          <Accordion.Header className="accordion-header rounded-lg">
                            {item}
                          </Accordion.Header>
                          <br/>
                          <Accordion.Collapse eventKey={`doc-${i}`}>
                            <div className="accordion-body">
                              {uploads[i] ? (
                                <>
                                  <iframe 
                                    title={item} 
                                    src={`https://drive.google.com/file/d/${uploads[i]}/preview`} 
                                    width="100%" 
                                    height="500" 
                                    allow="autoplay"
                                  ></iframe>
                                  <div className="mt-3">
                                    <a 
                                      target='_blank' 
                                      className='btn btn-primary' 
                                      href={`https://drive.usercontent.google.com/download?id=${uploads[i]}&export=download&authuser=0`}
                                      rel="noreferrer"
                                    >
                                      Download
                                    </a>
                                  </div>
                                </>
                              ) : (
                                <p className='text-light'>There is no document to display.</p>
                              )}
                            </div>
                          </Accordion.Collapse>
                        </Accordion.Item>
                      ))}
                    </Accordion>
                  </div>
                </div>
              </Tab.Pane>
              {/* for Expoter */}
              <Tab.Pane eventKey="exporter" id='expoter'>
                <div className='card'>
                  <div className='card-body'>
                    <Accordion className="accordion accordion-primary" defaultActiveKey="exportation">
                      <Accordion.Item className="accordion-item" key="exportation" eventKey="exportation">
                        <Accordion.Header className="accordion-header rounded-lg">
                          Basic Info
                        </Accordion.Header>
                        <Accordion.Collapse eventKey="exportation">
                          <div className="accordion-body">
                            <div className='row'>
                             
                              <div className='col-lg-6'>
                               
                                  <>
                                    <h4 className="text-primary mb-2 mt-4">Company Name</h4>
                                    <p className="text-light" style={{ textDecoration: 'none' }}>{company.company.name}</p>
                                  </>
                                  <>
                                    <h4 className="text-primary mb-2 mt-4">Company Address</h4>
                                    <p className="text-light" style={{ textDecoration: 'none' }}>{company.company.address}</p>
                                  </>
                             
                                  <>
                                    <h4 className="text-primary mb-2 mt-4">Company Country</h4>
                                    <p className="text-light" style={{ textDecoration: 'none' }}>{company.company.country}</p>
                                  </>
                              
                                  <>
                                    <h4 className="text-primary mb-2 mt-4">Company Number</h4>
                                    <p className="text-light" style={{ textDecoration: 'none' }}>{company.company.number}</p>
                                  </>
                               
                                  <>
                                    <h4 className="text-primary mb-2 mt-4">Company Type</h4>
                                    <p className="text-light" style={{ textDecoration: 'none' }}>
                                     {company.company.type}
                                    </p>
                                  </>
                             
                              </div>
                            </div>
                          </div>
                        </Accordion.Collapse>
                      </Accordion.Item>
                      <br/>
                      <Accordion.Item className="accordion-item" key="documents" eventKey="documents">
                        <Accordion.Header className="accordion-header rounded-lg">
                          Documents
                        </Accordion.Header>
                        <Accordion.Collapse eventKey="documents">
                          <div className="accordion-body">
                            {companyDocs.length > 0 ? (
                              <ListGroup>
                                {companyDocs.map((document, index) => (
                                  <ListGroup.Item key={index} className="d-flex justify-content-between align-items-center">
                                    <span className='accordion-body'>{document.type}</span>
                                    {/* <iframe 
                                    title={document} 
                                    src={`https://drive.google.com/file/d/${document.file}/preview`} 
                                    width="100%" 
                                    height="500" 
                                    allow="autoplay"
                                  ></iframe> */}
                                  
                                  <div className="mt-3">
                                    <a 
                                      target='_blank' 
                                      className='btn btn-primary' 
                                      href={`https://drive.usercontent.google.com/download?id=${document.file}&export=download&authuser=0`}
                                      rel="noreferrer"
                                    >
                                      Download
                                    </a>
                                  </div> 
                                 
                                  </ListGroup.Item>
                                ))}
                              </ListGroup>
                            ) : (
                              <p className="text-light">No documents available</p>
                            )}
                          </div>
                        </Accordion.Collapse>
                      </Accordion.Item>
                      
                      <br/>
                      <Accordion.Item className="accordion-item" key="transport" eventKey="transport">
                        <Accordion.Header className="accordion-header rounded-lg">
                          Shareholder
                        </Accordion.Header>
                        <Accordion.Collapse eventKey={`transport`}>
                          <div className="accordion-body">
                          {shareholder.length > 0 ? (
                            <div>
                             
                                {shareholder.map((document, index) => (
                                  <>
                                  <h4  key={index} className="text-primary mb-2 mt-4">Name:{document.name}</h4>
                                  <h4 className="text-light mb-2 mt-4">Percentage Owned:{document.percent}%</h4>
                                  <h4 className='text-light mb-2 mt-4'>Nationality:{document.nationality}</h4>
                                  <h4 className='text-light mb-2 mt-4'>Address:{document.address}</h4>
                                  <iframe 
                                    title={document} 
                                    src={`https://drive.google.com/file/d/${document.nationalID}/preview`} 
                                    width="100%" 
                                    height="500" 
                                    allow="autoplay"
                                  ></iframe> 

                      
                                  </>
                                ))}
                            </div>
                            ) : (
                              <p className="text-light">No documents available</p>
                            )}
                             
                          </div>
                        </Accordion.Collapse>
                      </Accordion.Item>
                      <br/>
                      <Accordion.Item className="accordion-item" key="representatives" eventKey="representatives">
                        <Accordion.Header className="accordion-header rounded-lg">
                        Beneficial Owners
                        </Accordion.Header>
                        <Accordion.Collapse eventKey={`representatives`}>
                          <div className="accordion-body">
                          {beneficial.length > 0 ? (
                            <div>
                             
                                {beneficial.map((owner, index) => (
                                  <>
                                  <h4  key={index} className="text-primary mb-2 mt-4">Name:{owner.name}</h4>
                                  <h4 className="text-light mb-2 mt-4">Percentage Owned:{owner.percent}%</h4>
                                  <h4 className='text-light mb-2 mt-4'>Nationality:{owner.nationality}</h4>
                                  <h4 className='text-light mb-2 mt-4'>Address:{owner.address}</h4>
                                  <iframe 
                                    title={owner} 
                                    src={`https://drive.google.com/file/d/${owner.nationalID}/preview`} 
                                    width="100%" 
                                    height="500" 
                                    allow="autoplay"
                                  ></iframe> 

                      
                                  </>
                                ))}
                            </div>
                            ) : (
                              <p className="text-light">No Beneficial Owner available</p>
                            )}
                         

                           
                          </div>
                        </Accordion.Collapse>
                      </Accordion.Item>
                      <br/>
                      <Accordion.Item className="accordion-item" key="incident" eventKey="incident">
                        <Accordion.Header className="accordion-header rounded-lg">
                        Incident
                        </Accordion.Header>
                        <Accordion.Collapse eventKey={`incident`}>
                          <div className="accordion-body">
                          
                              <p className="text-light">No Incident available</p>
                          </div>
                        </Accordion.Collapse>
                      </Accordion.Item>
                    </Accordion>
                  </div>
                </div>
              </Tab.Pane>
              {/* for Mine Tab Section */}
              <Tab.Pane eventKey="Mine" id='Mine'>
                <div className='card'>
                  <div className='card-body'>
                    <Accordion className="accordion accordion-primary" defaultActiveKey="exportation">
                      <Accordion.Item className="accordion-item" key="exportation" eventKey="exportation">
                        <Accordion.Header className="accordion-header rounded-lg">
                          Basic Info
                        </Accordion.Header>
                        <Accordion.Collapse eventKey="exportation">
                          <div className="accordion-body">
                            <div className='row'>
                             
                              <div className='col-lg-6'>
                               
                                  <>
                                    <h4 className="text-primary mb-2 mt-4">Company Name</h4>
                                    <p className="text-light" style={{ textDecoration: 'none' }}>{companymine.name}</p>
                                  </>
                                  <>
                                    <h4 className="text-primary mb-2 mt-4">Company Address</h4>
                                    <p className="text-light" style={{ textDecoration: 'none' }}>{companymine.address}</p>
                                  </>
                             
                                  <>
                                    <h4 className="text-primary mb-2 mt-4">Company Country</h4>
                                    <p className="text-light" style={{ textDecoration: 'none' }}>{companymine.country}</p>
                                  </>
                              
                                  <>
                                    <h4 className="text-primary mb-2 mt-4">Company Number</h4>
                                    <p className="text-light" style={{ textDecoration: 'none' }}>{companymine.number}</p>
                                  </>
                               
                                  <>
                                    <h4 className="text-primary mb-2 mt-4">Company Type</h4>
                                    <p className="text-light" style={{ textDecoration: 'none' }}>
                                     {companymine.type}
                                    </p>
                                  </>
                             
                              </div>
                            </div>
                          </div>
                        </Accordion.Collapse>
                      </Accordion.Item>
                      <br/>
                      <Accordion.Item className="accordion-item" key="documents" eventKey="documents">
                        <Accordion.Header className="accordion-header rounded-lg">
                          Documents
                        </Accordion.Header>
                        <Accordion.Collapse eventKey="documents">
                          <div className="accordion-body">
                            {companydocmine.length > 0 ? (
                              <ListGroup>
                                {companydocmine.map((document, index) => (
                                  <ListGroup.Item key={index} className="d-flex justify-content-between align-items-center">
                                    <span className='accordion-body'>{document.type}</span>
                                    {/* <iframe 
                                    title={document} 
                                    src={`https://drive.google.com/file/d/${document.file}/preview`} 
                                    width="100%" 
                                    height="500" 
                                    allow="autoplay"
                                  ></iframe> */}
                                  
                                  <div className="mt-3">
                                    <a 
                                      target='_blank' 
                                      className='btn btn-primary' 
                                      href={`https://drive.usercontent.google.com/download?id=${document.file}&export=download&authuser=0`}
                                      rel="noreferrer"
                                    >
                                      Download
                                    </a>
                                  </div> 
                                 
                                  </ListGroup.Item>
                                ))}
                              </ListGroup>
                            ) : (
                              <p className="text-light">No documents available</p>
                            )}
                          </div>
                        </Accordion.Collapse>
                      </Accordion.Item>
                      
                      <br/>
                      <Accordion.Item className="accordion-item" key="transport" eventKey="transport">
                        <Accordion.Header className="accordion-header rounded-lg">
                          Shareholder
                        </Accordion.Header>
                        <Accordion.Collapse eventKey={`transport`}>
                          <div className="accordion-body">
                          {compamnyshareholdermine.length > 0 ? (
                            <div>
                             
                                {compamnyshareholdermine.map((document, index) => (
                                  <>
                                  <h4  key={index} className="text-primary mb-2 mt-4">Name:{document.name}</h4>
                                  <h4 className="text-light mb-2 mt-4">Percentage Owned:{document.percent}%</h4>
                                  <h4 className='text-light mb-2 mt-4'>Nationality:{document.nationality}</h4>
                                  <h4 className='text-light mb-2 mt-4'>Address:{document.address}</h4>
                                  <iframe 
                                    title={document} 
                                    src={`https://drive.google.com/file/d/${document.nationalID}/preview`} 
                                    width="100%" 
                                    height="500" 
                                    allow="autoplay"
                                  ></iframe> 

                      
                                  </>
                                ))}
                            </div>
                            ) : (
                              <p className="text-light">No documents available</p>
                            )}
                             
                          </div>
                        </Accordion.Collapse>
                      </Accordion.Item>
                      <br/>
                      <Accordion.Item className="accordion-item" key="representatives" eventKey="representatives">
                        <Accordion.Header className="accordion-header rounded-lg">
                        Beneficial Owners
                        </Accordion.Header>
                        <Accordion.Collapse eventKey={`representatives`}>
                          <div className="accordion-body">
                          {companybeneficialmine.length > 0 ? (
                            <div>
                             
                                {companybeneficialmine.map((owner, index) => (
                                  <>
                                  <h4  key={index} className="text-primary mb-2 mt-4">Name:{owner.name}</h4>
                                  <h4 className="text-light mb-2 mt-4">Percentage Owned:{owner.percent}%</h4>
                                  <h4 className='text-light mb-2 mt-4'>Nationality:{owner.nationality}</h4>
                                  <h4 className='text-light mb-2 mt-4'>Address:{owner.address}</h4>
                                  <iframe 
                                    title={owner} 
                                    src={`https://drive.google.com/file/d/${owner.nationalID}/preview`} 
                                    width="100%" 
                                    height="500" 
                                    allow="autoplay"
                                  ></iframe> 

                      
                                  </>
                                ))}
                            </div>
                            ) : (
                              <p className="text-light">No Beneficial Owner available</p>
                            )}
                         

                           
                          </div>
                        </Accordion.Collapse>
                      </Accordion.Item>
                      <br/>
                      <Accordion.Item className="accordion-item" key="assessments" eventKey="assessments">
                  <Accordion.Header className="accordion-header rounded-lg">
                    Assessment
                  </Accordion.Header>
                  <Accordion.Collapse eventKey={`assessments`}>
                    <div className="accordion-body">
                      {!showAssessmentDetails ? (
                        <div>
                          <h3 className="text-primary mb-4">Mine Site</h3>
                          <h4 className="text-light">{minesite}</h4>
                          <button 
                            className="btn btn-primary mt-3" 
                            onClick={() => setShowAssessmentDetails(true)}
                          >
                            View Assessment Details
                          </button>
                        </div>
                      ) : (
                        renderAssessmentContent()
                      )}
                    </div>
                  </Accordion.Collapse>
                </Accordion.Item>
                      <br/>
                      <Accordion.Item className="accordion-item" key="incident" eventKey="incident">
                        <Accordion.Header className="accordion-header rounded-lg">
                        Incident
                        </Accordion.Header>
                        <Accordion.Collapse eventKey={`incident`}>
                          <div className="accordion-body">
                          {companybeneficialmine.length > 0 ? (
                            <div>
                             
                                {companybeneficialmine.map((owner, index) => (
                                  <>
                                  <h4  key={index} className="text-primary mb-2 mt-4">Name:{owner.name}</h4>
                                  <h4 className="text-light mb-2 mt-4">Percentage Owned:{owner.percent}%</h4>
                                  <h4 className='text-light mb-2 mt-4'>Nationality:{owner.nationality}</h4>
                                  <h4 className='text-light mb-2 mt-4'>Address:{owner.address}</h4>
                                  <iframe 
                                    title={owner} 
                                    src={`https://drive.google.com/file/d/${owner.nationalID}/preview`} 
                                    width="100%" 
                                    height="500" 
                                    allow="autoplay"
                                  ></iframe> 

                      
                                  </>
                                ))}
                            </div>
                            ) : (
                              <p className="text-light">No Incident available</p>
                            )}
                         

                           
                          </div>
                        </Accordion.Collapse>
                      </Accordion.Item>
                    
                    </Accordion>
                  </div>
                </div>
              </Tab.Pane>
            </Tab.Content>
          </div>
        </Tab.Container>
      </div>
    </div>
  );
};

export default ExportPage;
