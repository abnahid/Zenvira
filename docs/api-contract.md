# MediStore – System Contract

This document defines the core data models, user roles, and API behavior for the MediStore platform.
All frontend and backend features must follow this structure.

---

## User Roles

### Customer
- Browse medicines
- Add to cart
- Place orders
- Track order status
- Leave reviews

### Seller
- Add and manage medicines
- View assigned orders
- Update order status

### Admin
- Manage users
- Manage medicines
- Manage categories
- View all orders

---

## Core Data Models

### User
| Field        | Type                          | Notes           |
|--------------|-------------------------------|-----------------|
| id           | string (UUID)                 | Primary key     |
| name         | string                        | Required        |
| email        | string                        | Unique          |
| passwordHash | string                        | Hashed          |
| role         | customer \| seller \| admin   | Default: customer |
| status       | active \| banned              | Default: active |
| createdAt    | datetime                      | Auto-generated  |

### Medicine
| Field        | Type                    | Notes                    |
|--------------|-------------------------|--------------------------|
| id           | string (UUID)           | Primary key              |
| name         | string                  | Required                 |
| slug         | string                  | URL-friendly, unique     |
| price        | decimal                 | In smallest currency unit|
| categoryId   | string                  | FK → Category            |
| sellerId     | string                  | FK → User (seller)       |
| stock        | integer                 | Default: 0               |
| images       | string[]                | Array of URLs            |
| description  | text                    | Optional                 |
| manufacturer | string                  | Optional                 |
| status       | active \| hidden        | Default: active          |
| createdAt    | datetime                | Auto-generated           |

### Order
| Field           | Type                                                    | Notes              |
|-----------------|---------------------------------------------------------|--------------------|
| id              | string (UUID)                                           | Primary key        |
| customerId      | string                                                  | FK → User          |
| items           | OrderItem[]                                             | Embedded array     |
| total           | decimal                                                 | Calculated sum     |
| shippingAddress | object { street, city, state, zip, phone }              | Required           |
| status          | placed \| processing \| shipped \| delivered \| cancelled | Default: placed  |
| createdAt       | datetime                                                | Auto-generated     |

### OrderItem (embedded in Order)
| Field      | Type          | Notes                     |
|------------|---------------|---------------------------|
| medicineId | string        | FK → Medicine             |
| quantity   | integer       | Min: 1                    |
| price      | decimal       | Snapshot at order time    |

### Category
| Field | Type          | Notes               |
|-------|---------------|---------------------|
| id    | string (UUID) | Primary key         |
| name  | string        | Required            |
| slug  | string        | URL-friendly, unique|
| icon  | string        | Icon name or URL    |

### Review
| Field      | Type          | Notes                |
|------------|---------------|----------------------|
| id         | string (UUID) | Primary key          |
| medicineId | string        | FK → Medicine        |
| userId     | string        | FK → User            |
| rating     | integer       | 1–5                  |
| comment    | text          | Optional             |
| createdAt  | datetime      | Auto-generated       |

---

## API Rules

### Authentication
- Login returns JWT in HTTP-only cookie
- All private routes require valid token
- Role-based access enforced by middleware
- Token expiry: 7 days (refresh on activity)

### Medicines
- **Public**: Can only view medicines where `status = active`
- **Seller**: Can only create/edit/delete their own medicines
- **Admin**: Can edit or remove any medicine

### Orders
- **Customer**: Can only see their own orders
- **Seller**: Can only see orders containing their medicines
- **Admin**: Can see all orders

### Reviews
- **Customer**: Can only review medicines they have purchased
- **Customer**: One review per medicine per user
- **Admin**: Can delete any review

### Categories
- **Public**: Read-only access
- **Admin**: Full CRUD access

---

## Order Status Flow

```
placed → processing → shipped → delivered
   ↓
cancelled
```

### Transition Rules

| From       | To         | Who Can Do It      | Conditions                    |
|------------|------------|--------------------|-------------------------------|
| placed     | processing | Seller             | Has items from that seller    |
| processing | shipped    | Seller             | -                             |
| shipped    | delivered  | System / Admin     | Delivery confirmation         |
| placed     | cancelled  | Customer           | Only when status = placed     |
| any        | cancelled  | Admin              | -                             |

### Business Rules
- Stock is decremented when order is **placed**
- Stock is restored if order is **cancelled**
- Price is locked at order time (no retroactive changes)
- Cancellation not allowed after **processing** begins

---

## Validation Rules

### User
- Email must be valid format
- Password minimum 8 characters
- Name minimum 2 characters

### Medicine
- Price must be > 0
- Stock must be >= 0
- Name minimum 3 characters
- Slug auto-generated from name if not provided

### Order
- Must have at least 1 item
- All items must have stock available
- Shipping address required

### Review
- Rating must be 1–5
- User must have purchased the medicine

---

## Error Response Format

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Human readable message",
    "details": {}
  }
}
```

### Standard Error Codes
| Code              | HTTP Status | Meaning                        |
|-------------------|-------------|--------------------------------|
| VALIDATION_ERROR  | 400         | Invalid input data             |
| UNAUTHORIZED      | 401         | Not logged in                  |
| FORBIDDEN         | 403         | Insufficient permissions       |
| NOT_FOUND         | 404         | Resource doesn't exist         |
| CONFLICT          | 409         | Duplicate or state conflict    |
| INTERNAL_ERROR    | 500         | Server error                   |

---

## Success Response Format

```json
{
  "success": true,
  "data": {}
}
```

For paginated lists:
```json
{
  "success": true,
  "data": [],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "totalPages": 5
  }
}
```
