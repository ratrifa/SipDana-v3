import { Container, Row, Col, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
// Tambahkan ikon baru: JournalCheck, BarChartLine, ShieldLock
import { ArrowRight, ChevronDown, Instagram, Linkedin, Twitter, EnvelopeFill, GeoAltFill, Whatsapp, JournalCheck, BarChartLine, ShieldLock } from 'react-bootstrap-icons';

import LogoBiru from '../assets/Logo Biru.svg'; 

const StartPage = () => {
    const heroStyle = {
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #ffffff 0%, #ffffff 100%)',
        position: 'relative' as const,
    };

    const scrollToAbout = () => {
        document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <div style={{ backgroundColor: '#ffffff' }}>
            
            {/* === HERO SECTION === */}
            <div style={heroStyle} className="p-4 p-md-5">
                <Container>
                    <Row className="justify-content-center align-items-center">
                        <Col md={6} lg={5} className="text-center text-md-start order-2 order-md-1">
                            <div className="pe-lg-5">
                                <h5 className="text-primary fw-bold mb-3 text-uppercase" style={{ letterSpacing: '2px', fontSize: '14px' }}>
                                    Smart Financial Manager
                                </h5>
                                <h1 className="display-3 fw-bold mb-3 text-dark" style={{ letterSpacing: '-2px', lineHeight: '1.1' }}>
                                    Kelola Dana <br /> 
                                    <span className="text-primary">Jadi Lebih Sip.</span>
                                </h1>
                                <p className="text-muted fs-5 mb-5" style={{ lineHeight: '1.6' }}>
                                    Pantau pemasukan, atur pengeluaran, dan capai target menabung Anda dalam satu aplikasi yang cerdas dan mudah.
                                </p>
                                <div className="d-flex flex-column flex-md-row gap-3">
                                    <Link to="/login" className="text-decoration-none">
                                        <button className="btn btn-primary px-5 py-3 fw-bold shadow-sm d-flex align-items-center justify-content-center" style={{ borderRadius: '15px', minWidth: '180px' }}>
                                            Mulai Sekarang <ArrowRight className="ms-2" />
                                        </button>
                                    </Link>
                                    <Link to="/register" className="text-decoration-none">
                                        <button className="btn btn-outline-primary px-5 py-3 fw-bold" style={{ borderRadius: '15px', minWidth: '180px', borderWidth: '2px' }}>
                                            Daftar Akun
                                        </button>
                                    </Link>
                                </div>
                            </div>
                        </Col>
                        <Col md={6} className="text-center order-1 order-md-2 mb-5 mb-md-0">
                            <div className="position-relative d-flex justify-content-center align-items-center">
                                <div style={{ position: 'absolute', width: '100%', height: '100%', backgroundColor: '#0d6efd', borderRadius: '50%', filter: 'blur(100px)', opacity: '0.12', zIndex: 0 }}></div>
                                <img src={LogoBiru} alt="Logo" className="img-fluid" style={{ maxWidth: '120%', width: '500px', zIndex: 1 }} />
                            </div>
                        </Col>
                    </Row>
                </Container>

                <div onClick={scrollToAbout} className="position-absolute d-flex flex-column align-items-center" style={{ bottom: '30px', cursor: 'pointer', zIndex: 10, color: '#6c757d' }}>
                    <small className="mb-2 fw-bold text-uppercase" style={{ letterSpacing: '1px', fontSize: '10px' }}>Scroll Kebawah</small>
                    <div className="animate_animated animatebounce animate_infinite">
                        <ChevronDown size={24} className="text-primary" />
                    </div>
                </div>
            </div>

            {/* === SECTION: ABOUT US (BARU) === */}
            <div id="about" className="py-5 bg-light">
                <Container className="py-5">
                    <Row className="text-center mb-5">
                        <Col lg={8} className="mx-auto">
                            <h6 className="text-primary fw-bold text-uppercase mb-3" style={{ letterSpacing: '1px' }}>Tentang Kami</h6>
                            <p className="text-muted fs-5 mx-auto" style={{ maxWidth: '700px' }}>
                                SipDana bukan sekadar pencatat uang. Si pDana adalah asisten pintar yang dirancang untuk membantu Anda membangun kebiasaan finansial yang sehat dan masa depan yang lebih tertata.
                            </p>
                        </Col>
                    </Row>

                    <Row className="g-4">
                        {/* Pilar 1 */}
                        <Col md={4}>
                            <Card className="border-0 shadow-sm h-100 p-4" style={{ borderRadius: '25px' }}>
                                <Card.Body>
                                    <div className="mb-4 text-primary bg-primary bg-opacity-10 d-inline-flex p-3 rounded-4">
                                        <JournalCheck size={32} />
                                    </div>
                                    <h4 className="fw-bold mb-3">Pencatatan Cerdas</h4>
                                    <p className="text-muted mb-0">Lupakan catatan manual yang membosankan. Input transaksi Anda dalam hitungan detik dengan kategori yang otomatis tersusun rapi.</p>
                                </Card.Body>
                            </Card>
                        </Col>

                        {/* Pilar 2 */}
                        <Col md={4}>
                            <Card className="border-0 shadow-sm h-100 p-4" style={{ borderRadius: '25px' }}>
                                <Card.Body>
                                    <div className="mb-4 text-primary bg-primary bg-opacity-10 d-inline-flex p-3 rounded-4">
                                        <BarChartLine size={32} />
                                    </div>
                                    <h4 className="fw-bold mb-3">Analisis Visual</h4>
                                    <p className="text-muted mb-0">Pahami ke mana perginya setiap rupiah Anda melalui grafik interaktif yang membantu Anda mengevaluasi pengeluaran bulanan.</p>
                                </Card.Body>
                            </Card>
                        </Col>

                        {/* Pilar 3 */}
                        <Col md={4}>
                            <Card className="border-0 shadow-sm h-100 p-4" style={{ borderRadius: '25px' }}>
                                <Card.Body>
                                    <div className="mb-4 text-primary bg-primary bg-opacity-10 d-inline-flex p-3 rounded-4">
                                        <ShieldLock size={32} />
                                    </div>
                                    <h4 className="fw-bold mb-3">Privasi & Keamanan</h4>
                                    <p className="text-muted mb-0">Data keuangan Anda adalah privasi Anda. Kami menggunakan enkripsi standar industri untuk memastikan data Anda aman dan tidak dapat diakses orang lain.</p>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                </Container>
            </div>

            {/* === SECTION: HUBUNGI KAMI === */}
            <div id="contact" className="py-5 border-top border-bottom">
                <Container className="py-5">
                    <Row className="align-items-center">
                        <Col xs={12} md={3} className="text-center text-md-start mb-4 mb-md-0">
                            <span className="text-muted fw-bold small text-uppercase" style={{ letterSpacing: '1px' }}><ArrowRight className="ms-1" /></span>
                        </Col>
                        <Col xs={12} md={6} className="text-center">
                            <h2 className="display-4 fw-bold text-dark mb-0" style={{ letterSpacing: '-1px' }}>Hubungi Kami</h2>
                        </Col>
                        <Col xs={12} md={3} className="text-center text-md-end mb-4 mb-md-0">
                            <span className="text-muted fw-bold small text-uppercase" style={{ letterSpacing: '1px' }}><ArrowRight className="ms-1" /></span>
                        </Col>
                    </Row>
                </Container>
            </div>

            {/* === FOOTER (Gelap) === */}
            <footer style={{ backgroundColor: '#ffffff', color: '#000000' }} className="pt-5 pb-4">
                <Container>
                    <Row className="gy-5">
                        <Col lg={4} md={6}>
                            <h3 className="fw-bold mb-4">SipDana<span className="text-primary">.</span></h3>
                            <p className="text-muted pe-lg-5" style={{ fontSize: '15px' }}>Solusi pengelolaan keuangan pribadi yang cerdas untuk masa depan yang lebih tertata.</p>
                        </Col>
                        <Col lg={3} md={6}>
                            <h6 className="fw-bold text-uppercase mb-4" style={{ fontSize: '12px', letterSpacing: '1px' }}>Lokasi</h6>
                            <ul className="list-unstyled text-muted" style={{ fontSize: '14px' }}>
                                <li className="mb-3 d-flex align-items-start gap-2">
                                    <GeoAltFill className="text-primary mt-1" />
                                    <span>Jawa Barat, Indonesia</span>
                                </li>
                                <li className="d-flex align-items-center gap-2">
                                    <Whatsapp className="text-primary" />
                                    <span>+62 812-3456-7890</span>
                                </li>
                            </ul>
                        </Col>
                        <Col lg={3} md={6}>
                            <h6 className="fw-bold text-uppercase mb-4" style={{ fontSize: '12px', letterSpacing: '1px' }}>Bantuan</h6>
                            <ul className="list-unstyled text-muted" style={{ fontSize: '14px' }}>
                                <li className="mb-3">sipdana@business.com</li>
                                <li className="mb-3">Pertanyaan Umum</li>
                                <li>Syarat & Ketentuan</li>
                            </ul>
                        </Col>
                        <Col lg={2} md={6}>
                            <h6 className="fw-bold text-uppercase mb-4" style={{ fontSize: '12px', letterSpacing: '1px' }}>Ikuti Kami</h6>
                            <div className="d-flex gap-3 mb-4">
                                <Instagram className="text-muted" size={20} />
                                <Linkedin className="text-muted" size={20} />
                                <Twitter className="text-muted" size={20} />
                                <EnvelopeFill className="text-muted" size={20} />
                            </div>
                           
                        </Col>
                    </Row>
                    <div className="border-top border-secondary mt-5 pt-4 d-flex flex-column flex-md-row justify-content-between align-items-center text-muted small">
                        <p className="mb-md-0">© 2025 SipDana. All Rights Reserved.</p>
                        <div className="d-flex gap-4">
                            <span>Privacy Policy</span>
                            <span>Cookie Policy</span>
                        </div>
                    </div>
                </Container>
            </footer>
        </div>
    );
};

export default StartPage;