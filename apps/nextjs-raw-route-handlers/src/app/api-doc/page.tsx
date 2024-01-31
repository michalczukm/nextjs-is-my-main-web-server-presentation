import { getApiDocs } from '@mm/lib/swagger';
import { ReactSwagger } from '@mm/app/api-doc/react-swagger';

export default async function IndexPage() {
  const spec = await getApiDocs();
  return (
    <section className="container">
      <ReactSwagger spec={spec} />
    </section>
  );
}