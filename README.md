IP-Discrambler
IP-Discrambler is a lightweight, high-performance utility for resolving, decoding, and analyzing IP address information — including geolocation, WHOIS data, subnet parsing, and threat intelligence lookups.

[Image failed to load: License: MIT] [Image failed to load: Build Status] [Image failed to load: Version] [Image failed to load: Python] [Image failed to load: PRs Welcome]



Table of Contents
•	Overview
•	Features
•	Architecture
•	Getting Started
◦	Prerequisites
◦	Installation
◦	Configuration
•	Usage
◦	Command-Line Interface
◦	Python API
•	Examples
•	Output Formats
•	Roadmap
•	Contributing
•	License
•	Acknowledgements



Overview
IP-Discrambler addresses the challenge of rapidly extracting actionable intelligence from raw IP addresses in security, networking, and data-engineering workflows. Whether you are triaging a security incident, auditing network logs, or enriching a dataset, IP-Discrambler provides a single, unified interface to decode, classify, and annotate IP addresses at scale.

The project is designed with three guiding principles in mind: speed (batch processing thousands of IPs per second), extensibility (pluggable provider backends), and developer ergonomics (clean Python API alongside a powerful CLI).



Features
Feature	Description
Geolocation Lookup	Resolves country, region, city, latitude/longitude, and ISP for any public IP
WHOIS / RDAP Parsing	Fetches and parses registration data including ASN, org, and abuse contacts
Subnet & CIDR Analysis	Validates, expands, and summarizes IPv4/IPv6 CIDR blocks
Reverse DNS Resolution	Performs PTR record lookups with configurable timeout and retry logic
Threat Intelligence	Integrates with AbuseIPDB, VirusTotal, and Shodan for reputation scoring
Batch Processing	Accepts IP lists via file, stdin, or API with concurrent async execution
Multiple Output Formats	Supports JSON, CSV, YAML, and human-readable table output
IPv4 & IPv6 Support	Full dual-stack support across all modules
Offline Mode	Falls back to bundled MaxMind GeoLite2 databases when network is unavailable


Architecture
flowchart TD
    A[Input Source\nCLI / API / File / stdin] --> B[Input Parser & Validator]
    B --> C{IP Type?}
    C -->|Single IP| D[Resolver Engine]
    C -->|CIDR Block| E[Subnet Expander]
    C -->|Batch File| F[Async Batch Processor]
    D --> G[Provider Router]
    E --> G
    F --> G
    G --> H[Geolocation Provider]
    G --> I[WHOIS / RDAP Provider]
    G --> J[Threat Intel Provider]
    G --> K[Reverse DNS Resolver]
    H --> L[Result Aggregator]
    I --> L
    J --> L
    K --> L
    L --> M[Output Formatter]
    M --> N[JSON / CSV / YAML / Table]



Getting Started
Prerequisites
The following software must be installed before setting up IP-Discrambler.

•	Python 3.9 or higher
•	pip 22.0 or higher (bundled with Python 3.9+)
•	An active internet connection (for live lookups) or a local MaxMind GeoLite2 database (for offline mode)
•	Optional: API keys for AbuseIPDB, VirusTotal, or Shodan to enable threat intelligence features

Installation
From PyPI (recommended):

pip install ip-discrambler

From source:

git clone https://github.com/your-org/ip-discrambler.git
cd ip-discrambler
pip install -e ".[dev]"

Using Docker:

docker pull your-org/ip-discrambler:latest
docker run --rm your-org/ip-discrambler --help

Configuration
IP-Discrambler reads configuration from a .env file or environment variables. Copy the provided template and populate your credentials:

cp .env.example .env

Variable	Required	Description
ABUSEIPDB_API_KEY	Optional	API key for AbuseIPDB threat intelligence
VIRUSTOTAL_API_KEY	Optional	API key for VirusTotal IP reputation checks
SHODAN_API_KEY	Optional	API key for Shodan host intelligence
MAXMIND_DB_PATH	Optional	Absolute path to a local GeoLite2 .mmdb file
REQUEST_TIMEOUT	Optional	HTTP request timeout in seconds (default: 10)
MAX_CONCURRENCY	Optional	Maximum concurrent async workers (default: 50)


Usage
Command-Line Interface
IP-Discrambler exposes a full-featured CLI via the ipdis command.

Look up a single IP address:

ipdis lookup 8.8.8.8

Look up multiple IPs from a file:

ipdis lookup --file ips.txt --output json > results.json

Analyze a CIDR subnet:

ipdis subnet 192.168.1.0/24 --expand

Run a threat intelligence check:

ipdis threat 45.33.32.156 --providers abuseipdb,virustotal

Batch process with CSV output:

ipdis lookup --file ips.txt --output csv --concurrency 100 > enriched.csv

Run ipdis --help or ipdis <command> --help for a full list of options.

Python API
IP-Discrambler can be embedded directly into Python applications.

from ip_discrambler import Discrambler
 
# Initialize with optional configuration overrides
client = Discrambler(timeout=15, max_concurrency=100)
 
# Single IP lookup
result = client.lookup("8.8.8.8")
print(result.country, result.asn, result.isp)
 
# Batch lookup (async under the hood)
results = client.lookup_batch(["1.1.1.1", "8.8.4.4", "208.67.222.222"])
for r in results:
    print(r.ip, r.city, r.threat_score)
 
# Subnet analysis
subnet = client.analyze_subnet("10.0.0.0/8")
print(subnet.total_hosts, subnet.usable_hosts)

Full API reference is available in the documentation.



Examples
The examples/ directory contains ready-to-run scripts demonstrating common use cases.

Example	Description
examples/enrich_access_log.py	Parse an Nginx access log and enrich each IP with geo and threat data
examples/subnet_audit.py	Audit a list of CIDR blocks and flag overlapping or reserved ranges
examples/threat_triage.py	Score a list of IPs and export high-risk entries to a CSV report
examples/batch_csv_pipeline.py	End-to-end pipeline: CSV in → enriched CSV out


Output Formats
IP-Discrambler supports four output formats, selectable via the --output flag or the output_format API parameter.

JSON (default):

{
  "ip": "8.8.8.8",
  "country": "United States",
  "country_code": "US",
  "region": "California",
  "city": "Mountain View",
  "latitude": 37.386,
  "longitude": -122.0838,
  "asn": "AS15169",
  "org": "Google LLC",
  "isp": "Google LLC",
  "reverse_dns": "dns.google",
  "threat_score": 0,
  "abuse_confidence": 0
}

CSV, YAML, and table formats are also supported and follow the same field schema.



Roadmap
The following capabilities are planned for upcoming releases. Community contributions toward any of these items are especially welcome.

•	☐v1.1 — REST API server mode (ipdis serve) with OpenAPI documentation
•	☐v1.2 — Plugin system for custom provider backends
•	☐v1.3 — Real-time streaming mode for live log tailing
•	☐v2.0 — Web dashboard for interactive IP investigation
•	☐Expanded threat intelligence integrations (Greynoise, IPQualityScore)
•	☐Native Windows installer and macOS Homebrew formula



Contributing
Contributions of all kinds are welcome — bug reports, feature requests, documentation improvements, and pull requests. Please read CONTRIBUTING.md before submitting a pull request to understand the development workflow, coding standards, and commit message conventions.

To set up a local development environment:

git clone https://github.com/your-org/ip-discrambler.git
cd ip-discrambler
pip install -e ".[dev]"
pre-commit install
pytest tests/

All pull requests must pass the CI pipeline (linting, type checks, and unit tests) before they can be merged. Please ensure your changes include appropriate test coverage.



License
This project is licensed under the MIT License. See the LICENSE file for the full text.



Acknowledgements
IP-Discrambler builds upon and is grateful to the following open-source projects and data providers.

•	MaxMind GeoLite2 — Free IP geolocation database
•	ipwhois — Python WHOIS/RDAP library
•	AbuseIPDB — Community-driven IP abuse reporting
•	Shodan — Internet-wide host intelligence
•	VirusTotal — Multi-engine threat intelligence platform



For questions, bug reports, or feature requests, please open an issue on GitHub.
