'use client';

export default function WarrantyPolicy() {
  return (
    <div className="min-h-screen bg-white py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Warranty Policy</h1>
        <p className="text-gray-600 mb-6">Last Updated: February 2024</p>

        <div className="space-y-8">
          <section>
            <h2 className="text-2xl font-bold mb-4">1. Warranty Coverage</h2>
            <p className="text-gray-700 mb-4">
              All D&L Furnitech furniture items come with a comprehensive 1-year manufacturing defect warranty from the date of delivery. This warranty covers defects in material and workmanship.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">2. What Is Covered</h2>
            <p className="text-gray-700 mb-4">
              The warranty covers the following defects:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>Structural defects in the wooden frame</li>
              <li>Defects in upholstery material (seams, tearing, discoloration)</li>
              <li>Defects in hardware, fasteners, or metal components</li>
              <li>Defects in hinges, locks, or moving parts</li>
              <li>Manufacturing defects in joints and connections</li>
              <li>Defects in finish or varnish (within reasonable expectations)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">3. What Is NOT Covered</h2>
            <p className="text-gray-700 mb-4">
              The following are not covered under warranty:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>Normal wear and tear</li>
              <li>Damage from accidents, misuse, or negligence</li>
              <li>Damage from improper assembly or installation</li>
              <li>Damage from environmental conditions (moisture, extreme temperature)</li>
              <li>Damage from unauthorized repairs or modifications</li>
              <li>Cosmetic damage (scratches, minor dents)</li>
              <li>Damage from moving or improper handling</li>
              <li>Fading or color change due to sunlight exposure</li>
              <li>Damage caused by pets or accidents</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">4. How to Claim Warranty</h2>
            <p className="text-gray-700 mb-4">
              To claim warranty:
            </p>
            <ol className="list-decimal pl-6 space-y-2 text-gray-700">
              <li>Report the defect within 30 days of discovery</li>
              <li>Provide order number and proof of purchase</li>
              <li>Provide clear photographs showing the defect</li>
              <li>Contact our warranty team with complete details</li>
              <li>We will inspect and assess the claim</li>
              <li>Approved claims will result in repair or replacement</li>
            </ol>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">5. Warranty Service Options</h2>
            <p className="text-gray-700 mb-4">
              Depending on the defect and item:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li><strong>Repair:</strong> We will repair the defect at no cost</li>
              <li><strong>Replacement:</strong> We will replace the item if repair is not feasible</li>
              <li><strong>Refund:</strong> In rare cases, full refund may be provided</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">6. Warranty Duration</h2>
            <div className="bg-gray-50 p-4 rounded-lg mb-4">
              <p className="text-gray-700 mb-2"><strong>Standard Warranty:</strong> 1 Year (covers manufacturing defects)</p>
              <p className="text-gray-700"><strong>Extended Warranty:</strong> Available for additional charge - covers 2-3 years</p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">7. Warranty Transfer</h2>
            <p className="text-gray-700 mb-4">
              Warranty is non-transferable. It applies only to the original purchaser who is the original owner of the item.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">8. Maintenance Tips</h2>
            <p className="text-gray-700 mb-4">
              To maintain your furniture and prevent defects:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>Keep furniture in a stable environment (avoid extreme temperature/humidity)</li>
              <li>Clean regularly with appropriate materials</li>
              <li>Use coasters and placemats to protect surfaces</li>
              <li>Avoid placing heavy items on delicate parts</li>
              <li>Follow assembly and care instructions provided</li>
              <li>Check and tighten hardware periodically</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">9. Contact Warranty Team</h2>
            <p className="text-gray-700 mb-4">
              For warranty claims or inquiries:
            </p>
            <p className="text-gray-700">
              Email: warranty@dandlfurnitech.com<br/>
              Phone: +91-XXXX-XXXX-XXXX<br/>
              Working Hours: Monday - Friday, 10 AM - 6 PM IST
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">10. Disclaimer</h2>
            <p className="text-gray-700 mb-4">
              D&L Furnitech reserves the right to modify warranty terms. Warranty claims that are deemed outside the coverage scope will be rejected. In such cases, repair/replacement can be done on a chargeable basis.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
