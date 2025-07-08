# Data

## UGent-Biblio data in Virtuoso SPARQL endpoint

A docker-compose file is provided to run a Virtuoso SPARQL endpoint with the UGent-Biblio data.

First, make sure the data is available in the `data/import/` folder as `publications.nt`. You can download the data from this [Nextcloud folder](https://cloud.ilabt.imec.be/index.php/s/mofLEFe4EwHZ39p) ([direct download](https://cloud.ilabt.imec.be/index.php/s/mofLEFe4EwHZ39p/download/publications.nt)).

Next, create a `.env` file next to the `docker-compose.yml` file with the following content:

```env
DBA_PASSWORD=replacei-with-your-secret-virtuoso-password
```

Then, run the following command to start the Virtuoso SPARQL endpoint:

```bash
docker compose up -d -e DBA_PASSWORD=*my-secret-virtuoso-password*
```

This will start the Virtuoso service, load the data using the `scripts/load-data.sql` script and enable CORS using the `scripts/add-cors.sql` script, and expose the SPARQL endpoint at `http://localhost:8890/sparql`.

Next, you need to set up SSL for the Virtuoso SPARQL endpoint. You can use Certbot to obtain a certificate.

```bash
# Start the SSL setup specific docker compose
docker compose -f docker-compose-setup-ssl.yml up -d

# Connect to the Certbot container
docker compose exec certbot sh

# Issue a certificate
certbot certonly --non-interactive --standalone --email YOUR.EMAIL.HERE --agree-tos -d DOMAIN.HERE

# Exit the container
exit

# Stop the SSL setup specific docker compose
docker compose -f docker-compose-setup-ssl.yml down
```

After obtaining the certificate, you can start the Virtuoso SPARQL endpoint with SSL enabled by running:

```bash
docker compose up -d
```

You can then query the data using the SPARQL endpoint. For example, you can use the following query to retrieve all publications:

```sparql
SELECT ?s ?p ?o
WHERE {
  ?s ?p ?o .
}
LIMIT 100
```

You can access the Virtuoso SPARQL endpoint at `http://localhost:8890/sparql`.
